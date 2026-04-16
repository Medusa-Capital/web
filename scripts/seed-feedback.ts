// scripts/seed-feedback.ts
//
// Inserts a starter set of real-feeling posts so /ideas isn't empty when
// members first land. Run once per environment.
//
// Usage:
//   bun scripts/seed-feedback.ts                      # uses DATABASE_URL
//   AUTHOR_EMAIL=you@example.com bun scripts/seed-feedback.ts
//                                                     # attribute posts to a real user
//
// Behavior:
//   - If AUTHOR_EMAIL matches an existing user → posts get author_id set
//   - Otherwise → posts are inserted with author_id = NULL (shows as
//     "Miembro anterior" in the UI). Useful for clean staging seeds.
//   - Skips inserting when a post with the same title already exists
//     (script is idempotent — safe to re-run).

import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { feedbackPosts, users } from "@/db/schema";

interface SeedPost {
  title: string;
  body: string;
  status?: "open" | "planned" | "in_progress" | "shipped" | "declined";
}

const SEEDS: SeedPost[] = [
  {
    title: "Alertas de nueva tesis publicada por email",
    body: "Cuando Alex publique una nueva tesis o actualización importante, me gustaría recibir un email automático en lugar de tener que revisar la web a diario. Idealmente con un resumen y enlace directo al artículo completo.",
    status: "planned",
  },
  {
    title: "Calculadora de posición sizing para cada tesis",
    body: "Una herramienta donde introduzca mi capital total y la calculadora me sugiera cuánto asignar a cada tesis activa según el risk-reward que Medusa publica. Que se actualice automáticamente cuando cambian las tesis.",
    status: "in_progress",
  },
  {
    title: "Discord o Telegram solo para miembros activos",
    body: "Echo de menos un canal donde poder discutir tesis con otros miembros y donde Alex pueda compartir comentarios rápidos sobre el mercado sin tener que escribir un artículo entero. Algo más informal que las llamadas mensuales.",
  },
  {
    title: "Histórico de track record más detallado por tesis",
    body: "El track record general está bien, pero me gustaría ver el rendimiento individual de cada tesis cerrada: precio de entrada, precio de salida, fecha, ROI absoluto, y el contexto macro en el que se ejecutó.",
    status: "planned",
  },
  {
    title: "Sesiones AMA mensuales con Alex grabadas",
    body: "Una llamada al mes de 60-90 minutos donde los miembros podamos preguntar lo que sea y Alex responda. Idealmente grabada para los que no podamos asistir en directo, con índice por preguntas para saltar a la que nos interese.",
    status: "open",
  },
  {
    title: "Vista 'Últimos cambios' del sistema Medusa",
    body: "Una página o feed que muestre todos los cambios recientes en las tesis activas: subidas/bajadas de conviction, cambios en stop loss, nuevas alertas. Ayudaría a saber qué ha cambiado desde la última vez que entré.",
    status: "open",
  },
  {
    title: "Modo lectura offline para tesis largas",
    body: "Algunas tesis son largas y me gustaría leerlas en el avión o en zonas sin cobertura. Idealmente exportar a PDF o guardar localmente desde la propia web, sin necesidad de copiar y pegar.",
  },
  {
    title: "Glosario de términos cripto integrado en los artículos",
    body: "En las tesis hay términos como TVL, MEV, restaking, etc. que algunos miembros no terminamos de dominar. Sería útil un tooltip que al pasar el ratón muestre la definición rápida sin sacarme del artículo.",
    status: "shipped",
  },
  {
    title: "Comparador de plataformas/protocolos en cada análisis",
    body: "Cuando Alex analiza un protocolo nuevo, sería útil ver una tabla comparativa con sus competidores directos: TVL, fees, tokenomics, equipo. Visualmente rápido para entender por qué este y no otro.",
    status: "open",
  },
  {
    title: "Sección de errores propios y aprendizajes",
    body: "Una sección honesta donde se documenten las tesis que no salieron bien, qué se aprendió, y cómo se está incorporando ese aprendizaje al sistema. La transparencia sobre los fallos refuerza la credibilidad.",
    status: "planned",
  },
  {
    title: "Webinar de onboarding para nuevos miembros",
    body: "Cuando me uní me costó orientarme: dónde está cada cosa, cómo se usa el sistema Medusa, qué tesis están vivas. Una sesión de 30 min grabada de bienvenida ahorraría tiempo a todos los nuevos.",
    status: "in_progress",
  },
  {
    title: "Filtrar tesis por horizonte temporal",
    body: "Me gustaría poder filtrar las tesis activas por horizonte: corto (< 3 meses), medio (3-12) o largo (> 12). Ayuda a alinear lo que entra al portfolio con mi propio horizonte personal.",
  },
  {
    title: "Acceso a las herramientas internas de research de Alex",
    body: "Si Alex usa scripts, scrapers o dashboards propios para llegar a sus conclusiones, me encantaría poder usar versiones simplificadas. No pido el código completo, solo poder reproducir parte del análisis con mis propios datos.",
    status: "declined",
  },
  {
    title: "Resumen ejecutivo en cada tesis (TL;DR)",
    body: "Las tesis bien fundamentadas son largas. Un TL;DR de 3-5 bullets al principio con: tesis central, catalizadores clave, riesgos principales, y horizonte temporal. Para decidir rápido si quiero leer el artículo completo.",
    status: "shipped",
  },
];

async function main() {
  const authorEmail = process.env.AUTHOR_EMAIL?.trim();
  let authorId: string | null = null;

  if (authorEmail) {
    const [u] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, authorEmail))
      .limit(1);
    if (!u) {
      console.error(
        `AUTHOR_EMAIL=${authorEmail} not found — re-run after that user logs in once, or unset the env var to seed without an author.`
      );
      process.exit(1);
    }
    authorId = u.id;
    console.log(`Attributing posts to user ${authorEmail} (${authorId})`);
  } else {
    console.log("No AUTHOR_EMAIL set — seeding with NULL author_id.");
  }

  let inserted = 0;
  let skipped = 0;

  for (const seed of SEEDS) {
    const existing = await db
      .select({ id: feedbackPosts.id })
      .from(feedbackPosts)
      .where(eq(feedbackPosts.title, seed.title))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(feedbackPosts).values({
      title: seed.title,
      body: seed.body,
      status: seed.status ?? "open",
      authorId,
    });
    inserted++;
  }

  console.log(
    `Seed complete: ${inserted} inserted, ${skipped} skipped (already existed).`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
