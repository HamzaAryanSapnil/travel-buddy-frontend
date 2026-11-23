"use client";

import { Star } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

const stats = [
  {
    value: 10000,
    suffix: "+",
    label: "Travel Plans Created",
  },
  {
    value: 50000,
    suffix: "+",
    label: "Active Users",
  },
  {
    value: 100,
    suffix: "+",
    label: "Countries Explored",
  },
  {
    value: 4.8,
    suffix: "/5",
    label: "Average Rating",
    icon: Star,
    decimals: 1,
  },
];

export default function Statistics() {
  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Join Thousands of Happy Travelers
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-border rounded-lg border border-border bg-card text-card-foreground overflow-hidden">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center p-6 md:p-8 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-primary tabular-nums">
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                      duration={2.5}
                    />
                  </span>
                  {Icon && (
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-base sm:text-lg text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}