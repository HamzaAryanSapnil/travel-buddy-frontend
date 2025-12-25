import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function VideoSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                A Simple Perfect Place to Get Lost
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Discover amazing travel destinations and experiences through our
                curated video content. Watch inspiring travel stories from fellow
                travelers and get inspired for your next adventure with Travel Buddy.
              </p>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  Explore curated travel destinations through engaging video content
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  Get inspired by real travel experiences and stories from our community
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  Learn about hidden gems and must-visit places for your next trip
                </span>
              </li>
            </ul>

            {/* CTA Button */}
            <div className="pt-4">
              <Button asChild size="lg">
                <Link href="/travel-plans">See All Travel Plans</Link>
              </Button>
            </div>
          </div>

          {/* Video Section */}
          <div className="animate-in fade-in slide-in-from-right duration-700">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/xcCCAqhuMcc?si=Wvd4G8p2wRCpXZd0"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

