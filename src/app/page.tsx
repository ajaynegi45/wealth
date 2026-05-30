import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { InsightsSection } from "@/components/home/InsightsSection";
import { SecurityBanner } from "@/components/home/SecurityBanner";
import { FeaturesBentoGrid } from "@/components/home/FeaturesBentoGrid";

export const unstable_instant = { prefetch: 'static' };

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-background pt-16">
        <HeroSection />
        <HowItWorksSection />
        <InsightsSection />
        <SecurityBanner />
        <FeaturesBentoGrid />
      </main>
      <Footer />
    </>
  );
}
