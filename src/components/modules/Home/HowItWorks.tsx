"use client";

import { Plus, UserPlus, Plane } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

const steps = [
  {
    number: 1,
    icon: Plus,
    title: "Create Your Plan",
    description:
      "Sign up and create your travel plan. Set destination, dates, budget, and travel type. Or use our AI planner for instant suggestions.",
    color: "text-white font-black",
    bgColor: "bg-blue-600 dark:bg-blue-400",
  },
  {
    number: 2,
    icon: UserPlus,
    title: "Invite & Collaborate",
    description:
      "Invite friends to join your plan. Collaborate on itinerary, share expenses, schedule meetups, and chat in real-time.",
    color: "text-white font-black",
    bgColor: "bg-purple-600 dark:bg-purple-400",
  },
  {
    number: 3,
    icon: Plane,
    title: "Travel & Enjoy",
    description:
      "Follow your itinerary, track expenses, share photos, and create memories. Review your trip and plan your next adventure!",
    color: "text-white font-black",
    bgColor: "bg-green-600 dark:bg-green-400",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground container mx-auto">
            Plan your trip in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 container mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={step.number} className="relative">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    {/* Step Number */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-4xl font-bold text-background-foreground dark:text-foreground`}>
                        <AnimatedNumber
                          value={step.number}
                          prefix="0"
                          duration={1.5}
                        />
                      </span>
                      <div className={`w-12 h-12 rounded-lg ${step.bgColor}/10 flex items-center justify-center text-white font-black`}>
                        <Icon className={`w-6 h-6 ${step.color}` } />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Arrow Connector - Desktop Only */}
                {!isLast && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-border" />
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-border border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
