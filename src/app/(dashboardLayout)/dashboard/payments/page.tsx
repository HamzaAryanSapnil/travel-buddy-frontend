import { getPayments } from "@/services/payments/getPayments";
import { getPaymentSummary } from "@/services/payments/getPaymentSummary";
import PaymentsTable from "@/components/modules/Subscriptions/PaymentsTable";
import PaymentSummary from "@/components/modules/Subscriptions/PaymentSummary";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default async function PaymentsPage() {
  const [paymentsResult, paymentSummaryResult] = await Promise.all([
    getPayments({ limit: 50 }),
    getPaymentSummary(),
  ]);

  const payments = paymentsResult.data || [];
  const paymentsError = paymentsResult.error || null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">
          View your payment history and billing information.
        </p>
      </div>

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
          No payment history yet.
        </Card>
      )}
    </div>
  );
}

