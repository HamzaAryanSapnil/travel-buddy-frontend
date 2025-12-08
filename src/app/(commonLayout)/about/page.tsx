import { Lightbulb, Users, Eye, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Force static rendering - about page has no server-side dependencies
export const dynamic = 'force-static';

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We leverage cutting-edge AI technology to simplify travel planning",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe the best trips are planned together",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear pricing, honest features, no hidden costs",
  },
  {
    icon: Heart,
    title: "User-Centric",
    description: "Your feedback drives our development",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Our Mission
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              At TravelBuddy, we believe that travel planning should be simple,
              collaborative, and enjoyable. Our mission is to empower travelers
              to create unforgettable experiences by providing intelligent tools
              for planning, collaboration, and organization. We combine the power
              of AI with human creativity to help you discover new destinations,
              plan perfect itineraries, and travel with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Our Story
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              TravelBuddy was born from a simple frustration: planning group
              trips was complicated and time-consuming. We set out to create a
              platform that makes travel planning as enjoyable as the trip
              itself. Founded in 2024, TravelBuddy has grown into a
              comprehensive platform trusted by thousands of travelers worldwide.
              We&apos;re constantly innovating to make your travel planning
              experience better.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                What We Stand For
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={value.title}
                    className="hover:shadow-lg transition-shadow duration-300 h-full"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

