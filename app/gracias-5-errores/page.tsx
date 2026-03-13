"use client";

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
  Download,
} from "lucide-react";
import { CalendlyEmbed } from "@/components/landing/CalendlyEmbed";
import { trackEvent } from "@/lib/analytics";

const PDF_PATH = "/assets/los-5-errores-que-cuestan-5-cifras-en-cripto.pdf";

export default function GraciasSistemaMedusaPage() {
  function handleDownloadClick() {
    trackEvent("pdf_download", {
      pdf_name: "5_errores_cripto",
      source: "thank_you_page",
    });
  }

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

            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-[#68fe9a]/10 text-[#68fe9a] border border-[#68fe9a]/20">
                ENVIADO CON ÉXITO
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
                Tu guía está lista
              </h1>
              <p className="text-[#B9B8EB]/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Descarga ahora los 5 errores que cuestan 5 cifras en cripto.
                14 páginas con los patrones que separan a los que pierden de los
                que acumulan.
              </p>
            </div>

            {/* PDF Download Button */}
            <div className="flex justify-center mb-8">
              <a
                href={PDF_PATH}
                download
                onClick={handleDownloadClick}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#50d98a] to-[#68fe9a] text-[#010052] font-semibold text-lg shadow-lg shadow-[#68fe9a]/20 hover:shadow-[#68fe9a]/40 transition-all duration-200 hover:scale-[1.02]"
              >
                <Download className="w-5 h-5" />
                Descargar guía gratis (PDF)
              </a>
            </div>

            {/* Email instruction card */}
            <div className="rounded-2xl p-6 border border-white/10 bg-[#1b1a64]/50 backdrop-blur-sm mb-16 max-w-lg mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#68fe9a]/10 flex items-center justify-center text-[#68fe9a] flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-white text-sm font-medium">
                    También te enviamos la guía por email como respaldo
                  </p>
                  <p className="text-[#B9B8EB]/60 text-sm">
                    Si no lo ves en tu bandeja, revisa spam o promociones
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
              <p className="text-center text-[#B9B8EB]/30 text-xs mt-4">
                Nombres modificados por privacidad. Testimonios reales de
                miembros de la comunidad.
              </p>
            </div>

            {/* Section 3: Calendly CTA */}
            <div className="rounded-2xl p-8 md:p-10 border border-[#6B4CE6]/30 bg-gradient-to-br from-[#1b1a64]/70 to-[#151450]/90 mb-16">
              <p className="text-[#9074F6] text-sm font-semibold uppercase tracking-wider mb-2">
                ¿Quieres acelerar tu progreso?
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6">
                Agenda Tu Diagnóstico Gratuito de Cartera (30 min)
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    icon: Shield,
                    text: "Revisión personalizada de tu estrategia actual",
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
                url="https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon"
                className="rounded-xl"
              />
            </div>

            {/* Section 4: What to Expect */}
            <div className="rounded-2xl p-8 border border-white/10 bg-[#1b1a64]/50 backdrop-blur-sm mb-12">
              <h2 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <ArrowRight className="w-5 h-5 text-[#68fe9a]" />
                Qué esperar en los próximos días
              </h2>
              <ul className="space-y-4">
                {[
                  "Hoy: un email con un test rápido para saber qué tipo de inversor eres",
                  "Mañana: cómo perdimos 19.878€ en el primer año y qué aprendimos",
                  "Día 2: el esquema del Sistema Medusa por dentro (PDF + vídeo)",
                  "Día 3-4: casos reales de alumnos + respuestas a las dudas más comunes",
                  "Día 7: si tiene sentido, cómo trabajar juntos",
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
