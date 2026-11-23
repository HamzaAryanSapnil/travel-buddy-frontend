import { ASSETS } from "@/constants/assets";
import { ROUTES } from "@/constants/routes";
import { projectConfig } from "@/config/project.config";
import AppImage from "@/components/shared/AppImage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function AboutSection() {
  const { homepageAbout } = projectConfig;

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-primary/10">
            <AppImage
              src={ASSETS.about.image}
              alt={ASSETS.about.alt}
              fill
              className="object-cover"
              sizes={ASSETS.about.sizes}
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-primary mb-2">
                {homepageAbout.smallHeading}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                {homepageAbout.mainHeading}
              </h2>
              <p className="text-lg font-semibold text-muted-foreground mb-6">
                {homepageAbout.subDescription}
              </p>
            </div>

            <ul className="space-y-3">
              {homepageAbout.bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>

            <Card>
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

            <div>
              <Button asChild size="lg">
                <Link href={ROUTES.ABOUT}>Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}