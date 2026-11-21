import Hero from "@/components/modules/Home/Hero";
import Statistics from "@/components/modules/Home/Statistics";
import DestinationGrid from "@/components/modules/Home/DestinationGrid";
import FeaturedPlansSection from "@/components/modules/Home/FeaturedPlansSection";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import KeyFeatures from "@/components/modules/Home/KeyFeatures";
import TestimonialSlider from "@/components/modules/Home/TestimonialSlider";
import PublicGallerySection from "@/components/modules/Home/PublicGallerySection";
import VideoSection from "@/components/modules/Home/VideoSection";
import AboutSection from "@/components/modules/Home/AboutSection";
import FAQSection from "@/components/modules/Home/FAQSection";
import Newsletter from "@/components/modules/Home/Newsletter";

export const dynamic = "force-static";

export default function Home() {
  return (
    <main>
      <Hero />
      <Statistics />
      <DestinationGrid />
      <FeaturedPlansSection />
      <HowItWorks />
      <KeyFeatures />
      <TestimonialSlider />
      <PublicGallerySection />
      <VideoSection />
      <AboutSection />
      <FAQSection />
      <Newsletter />
    </main>
  );
}