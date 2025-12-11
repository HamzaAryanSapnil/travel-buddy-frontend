"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createSubscription } from "@/services/subscriptions/createSubscription";
import { cancelSubscription } from "@/services/subscriptions/cancelSubscription";
import { updateSubscription } from "@/services/subscriptions/updateSubscription";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SubscriptionActionsProps {
  subscriptionId?: string | null;
  hasActiveSubscription: boolean;
  onSubscribe?: (planType: "MONTHLY" | "YEARLY") => void;
}

const PLAN_PRICES = {
  MONTHLY: 9.99,
  YEARLY: 99.99,
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
};

export default function SubscriptionActions({
  subscriptionId,
  hasActiveSubscription,
  onSubscribe,
}: SubscriptionActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubscribe = (planType: "MONTHLY" | "YEARLY") => {
    // If parent component provides onSubscribe handler, use it
    if (onSubscribe) {
      onSubscribe(planType);
      return;
    }

    // Otherwise, use default handler
    startTransition(async () => {
      const formData = new FormData();
      formData.append("planType", planType);
      const result = await createSubscription(null, formData);
      if (result.success) {
        // Check if checkout URL is provided for Stripe redirect
        // Backend returns 'url', but we also support 'checkoutUrl' for compatibility
        const checkoutUrl = result.data?.url || result.data?.checkoutUrl;
        if (checkoutUrl) {
          // Redirect to Stripe checkout
          window.location.href = checkoutUrl;
        } else {
          toast.success(result.message);
          router.refresh();
        }
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleCancel = () => {
    if (!subscriptionId) return;
    startTransition(async () => {
      const result = await cancelSubscription(subscriptionId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleStopCancelAtPeriodEnd = () => {
    if (!subscriptionId) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("cancelAtPeriodEnd", "false");
      const result = await updateSubscription(subscriptionId, null, formData);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  if (!hasActiveSubscription) {
    return (
      <div className="flex gap-3 flex-wrap">
        <Button disabled={isPending} onClick={() => handleSubscribe("MONTHLY")}>
          {isPending
            ? "Subscribing..."
            : `Subscribe Monthly - ${formatPrice(PLAN_PRICES.MONTHLY)}`}
        </Button>
        <Button
          variant="secondary"
          disabled={isPending}
          onClick={() => handleSubscribe("YEARLY")}
        >
          {isPending
            ? "Subscribing..."
            : `Subscribe Yearly - ${formatPrice(PLAN_PRICES.YEARLY)}`}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <Button variant="destructive" disabled={isPending} onClick={handleCancel}>
        {isPending ? "Cancelling..." : "Cancel Subscription"}
      </Button>
      <Button
        variant="outline"
        disabled={isPending}
        onClick={handleStopCancelAtPeriodEnd}
      >
        {isPending ? "Updating..." : "Resume Subscription"}
      </Button>
    </div>
  );
}
