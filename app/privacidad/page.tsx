import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";

export const metadata = {
  title: "Política de Privacidad - Medusa Capital",
  description:
    "Política de privacidad de Medusa Capital. Información sobre cómo recopilamos, usamos y protegemos tus datos.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <main className="pt-8 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
                Política de Privacidad
              </h1>
              <p className="text-[#B9B8EB]/60">
                Última actualización: Enero 2025
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  1. Introducción
                </h2>
                <p className="text-[#B9B8EB]/70 leading-relaxed mb-4">
                  En Medusa Capital, nos comprometemos a proteger tu privacidad.
                  Esta política de privacidad explica cómo recopilamos, usamos,
                  compartimos y protegemos tu información personal cuando
                  utilizas nuestros servicios.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  2. Información que Recopilamos
                </h2>
                <p className="text-[#B9B8EB]/70 leading-relaxed mb-4">
                  Podemos recopilar los siguientes tipos de información:
                </p>
                <ul className="list-disc list-inside text-[#B9B8EB]/70 space-y-2 ml-4">
                  <li>
                    Información de contacto (nombre, correo electrónico)
                  </li>
                  <li>
                    Información de uso del sitio web
                  </li>
                  <li>
                    Datos de navegación y cookies
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  3. Uso de la Información
                </h2>
                <p className="text-[#B9B8EB]/70 leading-relaxed mb-4">
                  Utilizamos tu información para:
                </p>
                <ul className="list-disc list-inside text-[#B9B8EB]/70 space-y-2 ml-4">
                  <li>
                    Proporcionar y mejorar nuestros servicios
                  </li>
                  <li>
                    Comunicarnos contigo sobre actualizaciones y novedades
                  </li>
                  <li>
                    Analizar el uso de nuestro sitio web
                  </li>
                  <li>
                    Cumplir con obligaciones legales
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  4. Compartir Información
                </h2>
                <p className="text-[#B9B8EB]/70 leading-relaxed mb-4">
                  No vendemos ni alquilamos tu información personal a terceros.
                  Podemos compartir información con proveedores de servicios que
                  nos ayudan a operar nuestro sitio web, siempre bajo estrictas
                  condiciones de confidencialidad.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  5. Cookies
                </h2>
                <p className="text-[#B9B8EB]/70 leading-relaxed mb-4">
                  Utilizamos cookies y tecnologías similares para mejorar tu
                  experiencia en nuestro sitio web. Puedes configurar tu
                  navegador para rechazar cookies, aunque esto puede afectar
                  algunas funcionalidades del sitio.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  6. Seguridad
                </h2>
                <p className="text-[#B9B8EB]/70 leading-relaxed mb-4">
                  Implementamos medidas de seguridad técnicas y organizativas
                  para proteger tu información personal contra acceso no
                  autorizado, pérdida o destrucción.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  7. Tus Derechos
                </h2>
                <p className="text-[#B9B8EB]/70 leading-relaxed mb-4">
                  Tienes derecho a acceder, rectificar, eliminar y portar tus
                  datos personales. También puedes oponerte al procesamiento de
                  tus datos en determinadas circunstancias.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  8. Contacto
                </h2>
                <p className="text-[#B9B8EB]/70 leading-relaxed mb-4">
                  Si tienes preguntas sobre esta política de privacidad o sobre
                  cómo manejamos tus datos, puedes contactarnos a través de
                  nuestros canales oficiales.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  9. Cambios a esta Política
                </h2>
                <p className="text-[#B9B8EB]/70 leading-relaxed mb-4">
                  Nos reservamos el derecho de actualizar esta política de
                  privacidad en cualquier momento. Te notificaremos sobre
                  cambios significativos a través de nuestro sitio web.
                </p>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
