import Hero from "@/components/modules/Home/Hero";
import KeyFeatures from "@/components/modules/Home/KeyFeatures";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import Statistics from "@/components/modules/Home/Statistics";

// export const dynamic = 'force-static'; // Removed to allow cookie reading in layout

export default function Home() {
  console.log("my backend url is: ", process.env.NEXT_PUBLIC_BASE_API_URL);
  return (
    <main>
      <Hero />
      <KeyFeatures />
      <HowItWorks />
      <Statistics />
    </main>
  );
}
