import {
  Header,
  Hero,
  ProblemSection,
  Stats,
  ValueProp,
  Features,
  Modules,
  Team,
  InstitutionalQuotes,
  Testimonials,
  FAQ,
  FinalCTA,
  Footer,
  PageBackground,
  LeadCaptureModal,
  AnalysisFrameworkSection,
} from "@/components/landing";

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <Hero />
        <ProblemSection />
        <AnalysisFrameworkSection />
        <InstitutionalQuotes />
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
