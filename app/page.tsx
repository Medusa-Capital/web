import dynamic from "next/dynamic";
import {
  Header,
  Hero,
  ProblemSection,
  Features,
  PageBackground,
  AnalysisFrameworkSection,
} from "@/components/landing";

// Above-fold: static imports (critical path)
// Below-fold: dynamic imports (deferred hydration, SSR preserved for SEO)

const InstitutionalQuotes = dynamic(
  () => import("@/components/landing/InstitutionalQuotes").then((m) => ({ default: m.InstitutionalQuotes })),
  { loading: () => <div style={{ minHeight: "320px" }} /> }
);

const MissionSection = dynamic(
  () => import("@/components/landing/Stats").then((m) => ({ default: m.MissionSection })),
  { loading: () => <div style={{ minHeight: "500px" }} /> }
);

const Modules = dynamic(
  () => import("@/components/landing/Modules").then((m) => ({ default: m.Modules })),
  { loading: () => <div style={{ minHeight: "600px" }} /> }
);

const Team = dynamic(
  () => import("@/components/landing/Team").then((m) => ({ default: m.Team })),
  { loading: () => <div style={{ minHeight: "500px" }} /> }
);

const Testimonials = dynamic(
  () => import("@/components/landing/Testimonials").then((m) => ({ default: m.Testimonials })),
  { loading: () => <div style={{ minHeight: "800px" }} /> }
);

const FAQ = dynamic(
  () => import("@/components/landing/FAQ").then((m) => ({ default: m.FAQ })),
  { loading: () => <div style={{ minHeight: "400px" }} /> }
);

const FinalCTA = dynamic(
  () => import("@/components/landing/FinalCTA").then((m) => ({ default: m.FinalCTA })),
  { loading: () => <div style={{ minHeight: "300px" }} /> }
);

const Footer = dynamic(
  () => import("@/components/landing/Footer").then((m) => ({ default: m.Footer })),
  { loading: () => <div style={{ minHeight: "200px" }} /> }
);

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
