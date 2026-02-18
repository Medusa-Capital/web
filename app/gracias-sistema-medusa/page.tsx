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
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
                ¡Tu Sistema Medusa está en camino!
              </h1>
              <p className="text-[#B9B8EB]/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Revisa tu email ahora &mdash; te enviamos el PDF completo con el
                framework de 4 pasos, checklists y plantillas.
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
                      hola@medusacapital.xyz
                    </span>{" "}
                    a tus contactos
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Social Proof */}
            <div className="mb-16">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-8">
                Únete a 250+ inversores que usan el Sistema Medusa
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    quote:
                      "El framework me ayudó a filtrar el 90% de tokens basura. Ahora sólo invierto en lo que entiendo.",
                    name: "Carlos M.",
                    location: "Madrid",
                  },
                  {
                    quote:
                      "Antes compraba por hype. Ahora tengo un proceso sistemático que me da confianza.",
                    name: "Andrea L.",
                    location: "Buenos Aires",
                  },
                  {
                    quote:
                      "La sección de gestión de riesgo vale más que cualquier curso que haya pagado.",
                    name: "Pablo R.",
                    location: "Barcelona",
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

              <p className="text-center text-[#B9B8EB]/50 text-sm">
                El 85% de nuestros miembros reporta mayor confianza en sus
                decisiones de inversión
              </p>
            </div>

            {/* Section 3: Calendly CTA */}
            <div className="rounded-2xl p-8 md:p-10 border border-[#6B4CE6]/30 bg-gradient-to-br from-[#1b1a64]/70 to-[#151450]/90 mb-16">
              <p className="text-[#9074F6] text-sm font-semibold uppercase tracking-wider mb-2">
                ¿Quieres acelerar tu progreso?
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6">
                Agenda Tu Sesión Estratégica Gratuita (30 min)
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
                    text: "Claridad sobre si Medusa Pro es adecuado para ti (sin presión)",
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

              {/* TODO: Confirm Calendly URL with Javier */}
              <iframe
                src="https://calendly.com/medusacapital/sesion-estrategica"
                width="100%"
                height="700"
                frameBorder="0"
                className="rounded-xl"
                title="Agendar sesión estratégica"
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
                  "Hoy: Recibirás el PDF del Sistema Medusa por email",
                  "En 4 días: Contenido educativo personalizado sobre tu mayor desafío",
                  "En 2 semanas: Invitación a una sesión estratégica gratuita",
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

            {/* Section 5: Secondary CTA */}
            <div className="text-center">
              <p className="text-[#B9B8EB]/50 text-sm mb-6">
                Mientras tanto, explora más contenido
              </p>
              <Link href="/">
                <Button variant="secondaryGlow" size="lg" className="px-8">
                  Visitar Medusa Capital
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
