import { projectConfig } from "@/config/project.config";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function AboutSection() {
  const { homepageAbout } = projectConfig;

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-primary/10 animate-in fade-in slide-in-from-left duration-700">
            <Image
              src="/assets/images/travel-buddy-about.webp"
              alt={homepageAbout.mainHeading}
              fill
              className="object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-700">
            <div>
              <p className="text-sm font-semibold text-primary mb-2 animate-in fade-in slide-in-from-bottom duration-500">
                {homepageAbout.smallHeading}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-bottom duration-700">
                {homepageAbout.mainHeading}
              </h2>
              <p className="text-lg font-semibold text-muted-foreground mb-6 animate-in fade-in slide-in-from-bottom duration-800">
                {homepageAbout.subDescription}
              </p>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-3">
              {homepageAbout.bulletPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mt-1 flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>

            {/* Since Section */}
            <Card className="animate-in fade-in slide-in-from-bottom duration-700">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl font-bold text-primary">
                    {homepageAbout.sinceYear}
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">
                      Since {homepageAbout.sinceYear}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {homepageAbout.sinceDescription}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learn More Button */}
            <div className="animate-in fade-in slide-in-from-bottom duration-700">
              <Button asChild size="lg">
                <Link href={homepageAbout.learnMoreLink}>Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

