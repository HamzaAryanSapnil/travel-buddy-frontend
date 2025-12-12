import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/images/travel-buddy-hero.jpg";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Travel destination with mountains"
          fill
          className="object-cover"
          priority
          sizes="100%"
        />
      </div>

      {/* Gradient Overlay - Theme Aware */}
      {/* Light Mode: Dark gradient for text readability */}
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/60 via-black/70 to-black/80 dark:from-white/10 dark:via-white/20 dark:to-black/50" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="space-y-6">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Plan Your Perfect Trip with TravelBuddy
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 dark:text-gray-100 container mx-auto">
            Create, collaborate, and explore the world with friends. AI-powered
            travel planning made simple.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-lg"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 dark:bg-black/20 dark:border-white/20 dark:hover:bg-black/30"
            >
              <Link href="/travel-plans">Explore Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

