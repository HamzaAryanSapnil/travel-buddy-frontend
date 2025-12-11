import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  planType: "FREE" | "MONTHLY" | "YEARLY";
  price: number;
  currency?: string;
  interval?: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  currentPlan?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSubscribe?: (planType: "MONTHLY" | "YEARLY") => void;
  isPending?: boolean;
}

export default function PricingCard({ plan, onSubscribe, isPending }: PricingCardProps) {
  const formatPrice = (price: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price);
  };

  const isFree = plan.planType === "FREE";
  const isSubscribable = plan.planType === "MONTHLY" || plan.planType === "YEARLY";

  return (
    <Card
      className={cn(
        "relative flex flex-col h-full transition-all duration-300",
        plan.popular && "border-primary shadow-lg scale-105",
        plan.currentPlan && "ring-2 ring-primary"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="default" className="px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      {plan.currentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge variant="secondary" className="px-3 py-1">
            Current Plan
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
        <div className="mt-4">
          {isFree ? (
            <div className="text-4xl font-bold">Free</div>
          ) : (
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">{formatPrice(plan.price, plan.currency)}</span>
              {plan.interval && (
                <span className="text-muted-foreground text-lg">/{plan.interval}</span>
              )}
            </div>
          )}
          {plan.planType === "YEARLY" && (
            <p className="text-sm text-muted-foreground mt-2">
              Save ${(9.99 * 12 - 99.99).toFixed(2)} per year
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              ) : (
                <span className="h-5 w-5 shrink-0 mt-0.5 flex items-center justify-center">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                </span>
              )}
              <span
                className={cn(
                  "text-sm",
                  feature.included ? "text-foreground" : "text-muted-foreground line-through"
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      {isSubscribable && onSubscribe && (
        <CardFooter className="pt-6">
          <Button
            onClick={() => onSubscribe(plan.planType as "MONTHLY" | "YEARLY")}
            disabled={isPending || plan.currentPlan}
            className={cn(
              "w-full",
              plan.popular && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            variant={plan.popular ? "default" : "secondary"}
          >
            {isPending
              ? "Processing..."
              : plan.currentPlan
                ? "Current Plan"
                : `Subscribe ${plan.name}`}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

