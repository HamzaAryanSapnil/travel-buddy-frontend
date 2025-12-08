import { Sparkles, Users, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Planning",
    description:
      "Get personalized travel itineraries powered by advanced AI. Just answer a few questions and let our AI create the perfect plan for you.",
  },
  {
    icon: Users,
    title: "Collaborate with Friends",
    description:
      "Invite friends to your travel plans, share ideas, and plan together. Real-time chat and notifications keep everyone in sync.",
  },
  {
    icon: DollarSign,
    title: "Smart Expense Tracking",
    description:
      "Split expenses easily, track who paid what, and settle up with friends. Never worry about money management during trips.",
  },
  {
    icon: Calendar,
    title: "Organize Everything",
    description:
      "Manage your itinerary, meetups, media, and reviews all in one place. Stay organized and never miss a detail.",
  },
];

export default function KeyFeatures() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Choose TravelBuddy?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground container mx-auto">
            Everything you need to plan and enjoy your perfect trip
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="hover:shadow-lg transition-shadow duration-300 h-full"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

