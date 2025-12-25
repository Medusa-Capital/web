import {
  Header,
  Hero,
  Stats,
  ValueProp,
  Features,
  Modules,
  Team,
  Testimonials,
  FAQ,
  FinalCTA,
  Footer,
  PageBackground,
  LeadCaptureModal,
} from "@/components/landing";

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <Hero />
        <ValueProp />
        <Features />
        <Stats />
        <Modules />
        <Team />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
      <LeadCaptureModal />
    </main>
  );
}
