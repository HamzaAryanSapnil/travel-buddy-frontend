import { AdminPayment } from "@/types/admin.interface";
import { Card } from "@/components/ui/card";
import { PaymentStatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import Link from "next/link";

interface AdminPaymentsTableProps {
  payments: AdminPayment[];
  error?: string | null;
}

const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function AdminPaymentsTable({
  payments,
  error,
}: AdminPaymentsTableProps) {
  if (error) {
    return (
      <Card className="p-6 text-center text-destructive">
        Error loading payments: {error}
      </Card>
    );
  }

  if (!payments.length) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No payments found.
      </Card>
    );
  }

  return (
    <Card className="p-2 sm:p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-2">User</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Subscription</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const user = payment.user;
              const subscription = payment.subscription;

              return (
                <tr key={payment.id} className="border-b last:border-0">
                  <td className="py-3">
                    {user ? (
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </td>
                  <td className="py-3 font-medium">
                    {formatCurrency(payment.amount, payment.currency)}
                  </td>
                  <td className="py-3">
                    <PaymentStatusBadge status={payment.status} />
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {format(new Date(payment.createdAt), "PPP")}
                  </td>
                  <td className="py-3">
                    {subscription ? (
                      <div className="text-xs">
                        <div className="capitalize">
                          {subscription.planType?.toLowerCase() || "N/A"}
                        </div>
                        {subscription.id && (
                          <Link
                            href={`/admin/dashboard/subscriptions`}
                            className="text-primary hover:underline"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

