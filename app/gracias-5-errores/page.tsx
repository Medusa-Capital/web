import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import {
  CheckCircle2,
  Mail,
  ArrowRight,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { CalendlyEmbed } from "@/components/landing/CalendlyEmbed";

export default function GraciasSistemaMedusaPage() {
  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <main className="pt-8 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            {/* Section 1: Hero / Confirmation */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-t from-[#50d98a] to-[#68fe9a] flex items-center justify-center shadow-lg shadow-[#68fe9a]/20">
                <CheckCircle2 className="w-10 h-10 text-[#010052]" />
              </div>
            </div>

            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-[#68fe9a]/10 text-[#68fe9a] border border-[#68fe9a]/20">
                ENVIADO CON ÉXITO
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
                ¡Tu guía está en camino!
              </h1>
              <p className="text-[#B9B8EB]/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Revisa tu email ahora &mdash; te enviamos los 5 errores que
                cuestan 5 cifras, el caso Hyperliquid documentado y tu test de
                autodiagnóstico.
              </p>
            </div>

            {/* Email instruction card */}
            <div className="rounded-2xl p-6 border border-white/10 bg-[#1b1a64]/50 backdrop-blur-sm mb-16 max-w-lg mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#68fe9a]/10 flex items-center justify-center text-[#68fe9a] flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-white text-sm font-medium">
                    Normalmente llega en menos de 2 minutos
                  </p>
                  <p className="text-[#B9B8EB]/60 text-sm">
                    ¿No lo ves? Revisa tu carpeta de spam o promociones
                  </p>
                  <p className="text-[#B9B8EB]/60 text-sm">
                    Añade{" "}
                    <span className="text-[#B9B8EB]/80 font-medium">
                      contacto@medusacapital.xyz
                    </span>{" "}
                    a tus contactos
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Social Proof */}
            <div className="mb-16">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-8">
                Únete a 250+ inversores que ya aplican estos principios
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    quote:
                      "He pasado por varias comunidades de pago donde solo se enviaban señales y se usaba a la comunidad de exit liquidity. Aquí se hace todo lo contrario: se intenta que cada persona aprenda cómo funciona el mercado y sea capaz de tomar sus propias decisiones.",
                    name: "kaver",
                    location: "Alumno",
                  },
                  {
                    quote:
                      "Material de primera y comunidad muy activa. Se hizo pública una wallet con muchas ganancias y se explicó con detalle cómo se operó. Ese contenido no es nada frecuente en las redes.",
                    name: "Jordi77",
                    location: "Alumno",
                  },
                  {
                    quote:
                      "Ya tenía conocimientos y portafolio, me he formado en otras academias. Lo que he encontrado aquí es muy top, la formación no la había visto de esta calidad ni de cerca.",
                    name: "isaac81.",
                    location: "Alumno",
                  },
                ].map((testimonial, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-6 border border-white/10 bg-[#1b1a64]/50 backdrop-blur-sm"
                  >
                    <p className="text-[#B9B8EB]/80 text-sm leading-relaxed mb-4 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <p className="text-white text-sm font-medium">
                      {testimonial.name},{" "}
                      <span className="text-[#B9B8EB]/50">
                        {testimonial.location}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-center text-white text-sm">
                El 85% de nuestros miembros reporta mayor confianza en sus
                decisiones de inversión
              </p>
            </div>

            {/* Section 3: Calendly CTA */}
            <div className="rounded-2xl p-8 md:p-10 border border-[#6B4CE6]/30 bg-gradient-to-br from-[#1b1a64]/70 to-[#151450]/90 mb-16">
              <p className="text-[#9074F6] text-sm font-semibold uppercase tracking-wider mb-2">
                ¿QUIERES QUE REVISEMOS TU SITUACIÓN JUNTOS?
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6">
                Reserva tu diagnóstico gratuito (30 min)
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    icon: Shield,
                    text: "Revisión de tu cartera y proceso actual",
                  },
                  {
                    icon: Target,
                    text: "Identificación de tus mayores riesgos (que probablemente no ves)",
                  },
                  {
                    icon: TrendingUp,
                    text: "Plan de acción específico para tus objetivos",
                  },
                  {
                    icon: CheckCircle2,
                    text: "Claridad sobre si Medusa Capital es adecuado para ti (sin presión)",
                  },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#6B4CE6]/15 flex items-center justify-center text-[#9074F6] flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[#B9B8EB]/70 text-sm leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <CalendlyEmbed
                url="https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01"
                className="rounded-xl"
              />

              <p className="text-[#B9B8EB]/40 text-xs mt-6 leading-relaxed">
                Esta llamada es un diagnóstico educativo, no asesoramiento
                financiero personalizado. No realizamos recomendaciones de
                compra o venta de activos específicos. Cada inversor es
                responsable de sus propias decisiones.
              </p>
            </div>

            {/* Section 4: What to Expect */}
            <div className="rounded-2xl p-8 border border-white/10 bg-[#1b1a64]/50 backdrop-blur-sm mb-12">
              <h2 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <ArrowRight className="w-5 h-5 text-[#68fe9a]" />
                Qué esperar en los próximos días
              </h2>
              <ul className="space-y-4">
                {[
                  "Hoy: recibirás la guía de los 5 errores que cuestan 5 cifras en tu bandeja de entrada",
                  "Mañana: el dato de 2025 que explica por qué el 84,7% de tokens destruyen capital (y qué hace el 15% que gana)",
                  "En 3 días: el caso Hyperliquid por dentro (vídeo de 15 min)",
                  "En 5 días: caso real de un inversor + una pregunta incómoda",
                  "En 7 días: si tiene sentido, cómo trabajar juntos",
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#68fe9a]/10 text-[#68fe9a] text-xs font-semibold flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-[#B9B8EB]/70 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
