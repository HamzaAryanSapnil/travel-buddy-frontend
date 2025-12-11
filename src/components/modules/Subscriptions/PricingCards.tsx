import PricingCard, { PricingPlan } from "./PricingCard";
import { Subscription } from "@/types/subscription.interface";

interface PricingCardsProps {
  currentSubscription?: Subscription;
  onSubscribe?: (planType: "MONTHLY" | "YEARLY") => void;
  isPending?: boolean;
}

const FREE_PLAN: PricingPlan = {
  id: "free",
  name: "Free",
  planType: "FREE",
  price: 0,
  currency: "USD",
  description: "Perfect for occasional travelers",
  features: [
    { text: "10 AI requests per day", included: true },
    { text: "Create unlimited travel plans", included: true },
    { text: "Collaborate with friends", included: true },
    { text: "Expense tracking", included: true },
    { text: "Media gallery", included: true },
    { text: "Meetup scheduling", included: true },
    { text: "Unlimited AI requests", included: false },
    { text: "Priority support", included: false },
  ],
};

const MONTHLY_PLAN: PricingPlan = {
  id: "monthly",
  name: "Monthly",
  planType: "MONTHLY",
  price: 9.99,
  currency: "USD",
  interval: "month",
  description: "Best for regular travelers",
  popular: true,
  features: [
    { text: "Unlimited AI requests", included: true },
    { text: "Create unlimited travel plans", included: true },
    { text: "Collaborate with friends", included: true },
    { text: "Expense tracking", included: true },
    { text: "Media gallery", included: true },
    { text: "Meetup scheduling", included: true },
    { text: "Priority support", included: true },
    { text: "Advanced analytics", included: true },
  ],
};

const YEARLY_PLAN: PricingPlan = {
  id: "yearly",
  name: "Yearly",
  planType: "YEARLY",
  price: 99.99,
  currency: "USD",
  interval: "year",
  description: "Best value for frequent travelers",
  features: [
    { text: "Unlimited AI requests", included: true },
    { text: "Create unlimited travel plans", included: true },
    { text: "Collaborate with friends", included: true },
    { text: "Expense tracking", included: true },
    { text: "Media gallery", included: true },
    { text: "Meetup scheduling", included: true },
    { text: "Priority support", included: true },
    { text: "Advanced analytics", included: true },
  ],
};

export default function PricingCards({
  currentSubscription,
  onSubscribe,
  isPending,
}: PricingCardsProps) {
  // Determine which plan is currently active
  const currentPlanType = currentSubscription?.planType;

  const plans: PricingPlan[] = [
    {
      ...FREE_PLAN,
      currentPlan: !currentSubscription || currentSubscription.status === "CANCELLED",
    },
    {
      ...MONTHLY_PLAN,
      currentPlan: currentPlanType === "MONTHLY",
    },
    {
      ...YEARLY_PLAN,
      currentPlan: currentPlanType === "YEARLY",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          onSubscribe={onSubscribe}
          isPending={isPending}
        />
      ))}
    </div>
  );
}

