import Hero from "@/components/modules/Home/Hero";
import KeyFeatures from "@/components/modules/Home/KeyFeatures";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import Statistics from "@/components/modules/Home/Statistics";
import FeaturedPlansSection from "@/components/modules/Home/FeaturedPlansSection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedPlansSection />
      <KeyFeatures />
      <HowItWorks />
      <Statistics />
    </main>
  );
}
