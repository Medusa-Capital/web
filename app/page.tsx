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
} from "@/components/landing";

export default function Page() {
  return (
    <main className="medusa min-h-screen bg-black">
      <Header />
      <Hero />
      <Stats />
      <ValueProp />
      <Features />
      <Modules />
      <Team />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
