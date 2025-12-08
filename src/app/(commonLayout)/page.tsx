import Hero from "@/components/modules/Home/Hero";
import KeyFeatures from "@/components/modules/Home/KeyFeatures";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import Statistics from "@/components/modules/Home/Statistics";

// Force static rendering - homepage has no server-side dependencies
export const dynamic = 'force-static';

export default function Home() {
  return (
    <main>
      <Hero />
      <KeyFeatures />
      <HowItWorks />
      <Statistics />
    </main>
  );
}
