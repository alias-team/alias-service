import { CTASection } from "@/components/landing/cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { IntelligenceSection } from "@/components/landing/intelligence-section";
import { landingFontVariables } from "@/components/landing/landing-fonts";
import { StorySection } from "@/components/landing/story-section";

export default function Home() {
  return (
    <main
      aria-label="MCM Personal Editorial Engine"
      className={landingFontVariables}
    >
      <HeroSection />
      <IntelligenceSection />
      <StorySection />
      <CTASection />
    </main>
  );
}
