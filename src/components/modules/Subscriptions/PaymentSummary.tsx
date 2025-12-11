import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentSummary as PaymentSummaryType } from "@/types/payment.interface";
import { CheckCircle2, XCircle, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PaymentSummaryProps {
  summary: PaymentSummaryType | null;
  error?: string | null;
}

const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function PaymentSummary({ summary, error }: PaymentSummaryProps) {
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No payment data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Amount */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(summary.totalAmount, summary.currency)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Payment Status Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Succeeded */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Succeeded</p>
                <p className="text-lg font-semibold">{summary.succeededCount}</p>
              </div>
            </div>

            {/* Pending */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-lg font-semibold">{summary.pendingCount}</p>
              </div>
            </div>

            {/* Refunded */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Refunded</p>
                <p className="text-lg font-semibold">{summary.refundedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

