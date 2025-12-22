import Hero from "@/components/modules/Home/Hero";
import KeyFeatures from "@/components/modules/Home/KeyFeatures";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import Statistics from "@/components/modules/Home/Statistics";
import FeaturedPlansSection from "@/components/modules/Home/FeaturedPlansSection";
import PublicGallerySection from "@/components/modules/Home/PublicGallerySection";

export const dynamic = "force-static";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedPlansSection />
      <KeyFeatures />
      <PublicGallerySection />
      <Statistics />
      <HowItWorks />
    </main>
  );
}
