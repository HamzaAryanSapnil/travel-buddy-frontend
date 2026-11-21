"use client";

import { useState } from "react";
import { ASSETS } from "@/constants/assets";
import { HERO_SLIDES } from "@/constants/home";
import AppImage from "@/components/shared/AppImage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSearch from "@/components/modules/Home/HeroSearch";

export default function Hero() {
  const [index, setIndex] = useState(0);

  const goToSlide = (nextIndex: number) => {
    setIndex(nextIndex);
  };

  const slide = HERO_SLIDES[index];
  const heroImageOpacity = index === 1 ? 0 : 1;

  return (
    <section className="relative w-full">
      <MotionStyles />
      <div className="relative min-h-[600px] md:min-h-[700px] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 z-0 hero-image-layer"
          style={{ opacity: heroImageOpacity }}
          aria-hidden={index === 1}
        >
          <AppImage
            src={ASSETS.hero.image}
            alt={ASSETS.hero.alt}
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </div>
        {index === 1 ? (
          <div className="absolute inset-0 z-0 hero-image-layer" aria-hidden={false}>
            <AppImage
              src={ASSETS.about.image}
              alt={ASSETS.about.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ) : null}

        <div className="absolute inset-0 z-10 bg-linear-to-b from-black/55 via-black/45 to-black/70" />

        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pb-28">
          <div key={index} className="space-y-6 hero-text-block">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {slide.headline}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white container mx-auto">
              {slide.subtext}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg"
              >
                <Link href={slide.primary.href}>{slide.primary.label}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/10 dark:bg-black/20 dark:border-white/20 dark:hover:bg-black/30 hover:font-bold hover:text-primary"
              >
                <Link href={slide.secondary.href}>{slide.secondary.label}</Link>
              </Button>
            </div>

            <div
              className="flex justify-center gap-2 pt-2"
              role="group"
              aria-label="Hero slides"
            >
              {HERO_SLIDES.map((_, slideIndex) => (
                <button
                  key={slideIndex}
                  type="button"
                  className="h-2.5 w-2.5 rounded-full border border-white/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white data-[active=true]:bg-white data-[active=false]:bg-white/35"
                  aria-label={`Show slide ${slideIndex + 1}`}
                  aria-current={slideIndex === index ? "true" : undefined}
                  data-active={slideIndex === index}
                  onClick={() => goToSlide(slideIndex)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 -mb-14">
        <HeroSearch />
      </div>
    </section>
  );
}

function MotionStyles() {
  return (
    <style>{`
@media (prefers-reduced-motion: no-preference) {
  .hero-image-layer {
    transition: opacity 0.6s ease;
  }
}
`}</style>
  );
}