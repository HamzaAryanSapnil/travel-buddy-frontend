import { Sparkles, Users, DollarSign, Calendar } from "lucide-react";

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
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Choose TravelBuddy?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground container mx-auto">
            Everything you need to plan and enjoy your perfect trip
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-base text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}