"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSubscription } from "@/services/subscriptions/createSubscription";
import PricingCards from "./PricingCards";
import { Subscription } from "@/types/subscription.interface";

interface SubscriptionPageClientProps {
  subscription?: Subscription;
}

export default function SubscriptionPageClient({
  subscription,
}: SubscriptionPageClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubscribe = (planType: "MONTHLY" | "YEARLY") => {
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

  return (
    <PricingCards
      currentSubscription={subscription}
      onSubscribe={handleSubscribe}
      isPending={isPending}
    />
  );
}

