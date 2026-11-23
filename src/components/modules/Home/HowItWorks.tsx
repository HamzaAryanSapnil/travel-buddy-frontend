"use client";

import { Plus, UserPlus, Plane } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

const steps = [
  {
    number: 1,
    icon: Plus,
    title: "Create Your Plan",
    description:
      "Sign up and create your travel plan. Set destination, dates, budget, and travel type. Or use our AI planner for instant suggestions.",
  },
  {
    number: 2,
    icon: UserPlus,
    title: "Invite & Collaborate",
    description:
      "Invite friends to join your plan. Collaborate on itinerary, share expenses, schedule meetups, and chat in real-time.",
  },
  {
    number: 3,
    icon: Plane,
    title: "Travel & Enjoy",
    description:
      "Follow your itinerary, track expenses, share photos, and create memories. Review your trip and plan your next adventure!",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground container mx-auto">
            Plan your trip in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 container mx-auto">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-foreground">
                    <AnimatedNumber
                      value={step.number}
                      prefix="0"
                      duration={1.5}
                    />
                  </span>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-base text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}