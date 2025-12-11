import { getSubscriptionStatus } from "@/services/subscriptions/getSubscriptionStatus";
import { getPayments } from "@/services/payments/getPayments";
import { getPaymentSummary } from "@/services/payments/getPaymentSummary";
import SubscriptionPanel from "@/components/modules/Subscriptions/SubscriptionPanel";
import PaymentsTable from "@/components/modules/Subscriptions/PaymentsTable";
import PaymentSummary from "@/components/modules/Subscriptions/PaymentSummary";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import SubscriptionPageClient from "@/components/modules/Subscriptions/SubscriptionPageClient";

export default async function SubscriptionsPage() {
  const [subscriptionResult, paymentsResult, paymentSummaryResult] =
    await Promise.all([
      getSubscriptionStatus(),
      getPayments({ limit: 20 }),
      getPaymentSummary(),
    ]);

  // Handle null/undefined properly - backend returns null when no subscription
  const subscription =
    subscriptionResult.success && subscriptionResult.data
      ? subscriptionResult.data
      : undefined;

  const payments = paymentsResult.data || [];
  const paymentsError = paymentsResult.error || null;

  const hasActiveSubscription = !!subscription && !!subscription.id;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscriptions & Payments</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view billing history.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <SubscriptionPanel subscription={subscription} />
      </Suspense>

      {!hasActiveSubscription && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Choose Your Plan</h2>
            <p className="text-muted-foreground">
              Select the plan that best fits your travel planning needs.
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <SubscriptionPageClient subscription={subscription} />
          </Suspense>
        </div>
      )}

      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <PaymentSummary
          summary={paymentSummaryResult.data}
          error={paymentSummaryResult.error}
        />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <PaymentsTable payments={payments} error={paymentsError} />
      </Suspense>

      {!payments.length && !paymentsError && (
        <Card className="p-4 text-muted-foreground text-sm">
          No billing history yet.
        </Card>
      )}
    </div>
  );
}
