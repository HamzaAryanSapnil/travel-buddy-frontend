import { AdminPaymentStatistics } from "@/types/admin.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface PaymentStatisticsProps {
  statistics: AdminPaymentStatistics | null;
  error?: string | null;
}

const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function PaymentStatistics({
  statistics,
  error,
}: PaymentStatisticsProps) {
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!statistics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No payment statistics available.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extract counts from byStatus array if available, otherwise use direct properties
  const getStatusCount = (
    status: "SUCCEEDED" | "PENDING" | "REFUNDED" | "FAILED"
  ) => {
    if (statistics.byStatus) {
      const statusData = statistics.byStatus.find((s) => s.status === status);
      return statusData?.count || 0;
    }
    // Fallback to direct properties if byStatus is not available
    switch (status) {
      case "SUCCEEDED":
        return statistics.succeededCount || 0;
      case "PENDING":
        return statistics.pendingCount || 0;
      case "REFUNDED":
        return statistics.refundedCount || 0;
      case "FAILED":
        return statistics.failedCount || 0;
      default:
        return 0;
    }
  };

  // Get currency from byCurrency array or use default
  const getCurrency = () => {
    if (statistics.byCurrency && statistics.byCurrency.length > 0) {
      return statistics.byCurrency[0].currency;
    }
    return statistics.currency || "USD";
  };

  const succeededCount = getStatusCount("SUCCEEDED");
  const pendingCount = getStatusCount("PENDING");
  const refundedCount = getStatusCount("REFUNDED");
  const failedCount = getStatusCount("FAILED");
  const currency = getCurrency();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(statistics.totalRevenue, currency)}
          </div>
        </CardContent>
      </Card>

      {/* Succeeded */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Succeeded</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{succeededCount}</div>
        </CardContent>
      </Card>

      {/* Pending */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
        </CardContent>
      </Card>

      {/* Refunded */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Refunded</CardTitle>
          <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{refundedCount}</div>
        </CardContent>
      </Card>

      {/* Failed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{failedCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
