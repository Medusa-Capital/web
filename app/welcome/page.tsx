"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, TrendingUp, Users, ArrowRight } from "lucide-react";

const content = {
  title: "Gracias por unirte",
  subtitle: "Tu perfil ha sido registrado",
  description:
    "Tu respuesta nos ayuda a enviarte contenido relevante. En los próximos días recibirás emails adaptados a tus necesidades.",
  features: [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Contenido personalizado",
      description: "Emails adaptados a tu nivel y objetivos específicos.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Metodología Medusa",
      description: "Acceso a nuestra metodología de inversión institucional.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Comunidad",
      description: "Únete a una comunidad de inversores serios.",
    },
  ],
  nextSteps: [
    "Revisa tu bandeja de entrada (y spam) en las próximas 24-48h",
    "Recibirás la metodología Medusa en PDF",
    "Contenido progresivo durante los próximos días",
  ],
};

function WelcomeContent() {
  return (
    <main className="pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-t from-[#50d98a] to-[#68fe9a] flex items-center justify-center shadow-lg shadow-[#68fe9a]/20">
            <CheckCircle2 className="w-10 h-10 text-[#010052]" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-[#68fe9a]/10 text-[#68fe9a] border border-[#68fe9a]/20">
            {content.subtitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
            {content.title}
          </h1>
          <p className="text-[#B9B8EB]/80 text-lg leading-relaxed max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {content.features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 border border-white/10 bg-[#1b1a64]/50 backdrop-blur-sm transition-all duration-300 hover:border-[#68fe9a]/30 hover:bg-[#1b1a64]/70"
            >
              <div className="w-12 h-12 rounded-xl bg-[#68fe9a]/10 flex items-center justify-center text-[#68fe9a] mb-4">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-[#B9B8EB]/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Next Steps Card */}
        <div className="rounded-2xl p-8 border border-white/10 bg-[#1b1a64]/50 backdrop-blur-sm mb-12">
          <h2 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
            <ArrowRight className="w-5 h-5 text-[#68fe9a]" />
            Próximos pasos
          </h2>
          <ul className="space-y-4">
            {content.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#68fe9a]/10 text-[#68fe9a] text-xs font-semibold flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <span className="text-[#B9B8EB]/70 leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-[#B9B8EB]/50 text-sm mb-6">
            Mientras tanto, puedes explorar más sobre nosotros
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
  );
}

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-2 border-[#68fe9a] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <WelcomeContent />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
