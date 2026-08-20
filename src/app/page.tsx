import { ConnectSection } from "@/components/landing/connect-section";
import { CreateSection } from "@/components/landing/create-section";
import { CTASection } from "@/components/landing/cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { IntelligenceSection } from "@/components/landing/intelligence-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { landingFontVariables } from "@/components/landing/landing-fonts";
import { UnderstandSection } from "@/components/landing/understand-section";

export default function Home() {
  return (
    <main
      aria-label="MCM Personal Editorial Engine"
      className={`overflow-x-clip ${landingFontVariables}`}
    >
      <HeroSection />
      <IntelligenceSection />
      <UnderstandSection />
      <ConnectSection />
      <CreateSection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}
