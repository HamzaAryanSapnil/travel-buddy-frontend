import Hero from "@/components/modules/Home/Hero";
import KeyFeatures from "@/components/modules/Home/KeyFeatures";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import Statistics from "@/components/modules/Home/Statistics";
import FeaturedPlansSection from "@/components/modules/Home/FeaturedPlansSection";
import PublicGallerySection from "@/components/modules/Home/PublicGallerySection";
import AboutSection from "@/components/modules/Home/AboutSection";
import VideoSection from "@/components/modules/Home/VideoSection";
import FAQSection from "@/components/modules/Home/FAQSection";

export const dynamic = "force-static";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedPlansSection />
      <AboutSection />
      <VideoSection />
      <KeyFeatures />
      <PublicGallerySection />
      <FAQSection />
      <Statistics />
      <HowItWorks />
    </main>
  );
}
