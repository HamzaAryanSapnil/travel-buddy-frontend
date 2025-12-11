import { Payment } from "@/types/payment.interface";
import { Card } from "@/components/ui/card";
import { PaymentStatusBadge } from "./StatusBadge";
import { format } from "date-fns";

interface PaymentsTableProps {
  payments: Payment[];
  error?: string | null;
}

export default function PaymentsTable({ payments, error }: PaymentsTableProps) {
  if (error) {
    return (
      <Card className="p-6 text-center text-destructive">
        Error loading payments: {error}
      </Card>
    );
  }

  if (!payments.length) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No payment history yet.</p>
          {process.env.NODE_ENV === "development" && error && (
            <p className="text-xs text-destructive mt-2">
              Debug: {error}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            If you just completed a payment, it may take a few moments for the
            webhook to process. Please refresh the page.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-2 sm:p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Currency</th>
              <th className="text-left py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-2">
                  <PaymentStatusBadge status={p.status} />
                </td>
                <td className="py-2 font-medium">{p.amount.toFixed(2)}</td>
                <td className="py-2 uppercase">{p.currency}</td>
                <td className="py-2">{format(new Date(p.createdAt), "PPP")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

