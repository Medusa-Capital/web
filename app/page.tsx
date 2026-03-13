import {
  Header,
  Hero,
  ProblemSection,
  MissionSection,
  Features,
  Modules,
  Team,
  InstitutionalQuotes,
  Testimonials,
  FAQ,
  FinalCTA,
  Footer,
  PageBackground,
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
        <Features />
        <MissionSection />
        <Modules />
        <Team />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
