import { AdminSubscription } from "@/types/admin.interface";
import { Card } from "@/components/ui/card";
import { SubscriptionStatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import Link from "next/link";

interface SubscriptionsTableProps {
  subscriptions: AdminSubscription[];
  error?: string | null;
}

const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function SubscriptionsTable({
  subscriptions,
  error,
}: SubscriptionsTableProps) {
  if (error) {
    return (
      <Card className="p-6 text-center text-destructive">
        Error loading subscriptions: {error}
      </Card>
    );
  }

  if (!subscriptions.length) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No subscriptions found.
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
              <th className="text-left py-2">Plan Type</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Current Period</th>
              <th className="text-left py-2">Cancel at Period End</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => {
              const price = sub.plan?.price || 0;
              const currency = sub.plan?.currency || "USD";
              const user = sub.user;

              return (
                <tr key={sub.id} className="border-b last:border-0">
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
                  <td className="py-3">
                    <span className="capitalize">
                      {sub.planType?.toLowerCase() || "N/A"}
                    </span>
                  </td>
                  <td className="py-3">
                    <SubscriptionStatusBadge status={sub.status} />
                  </td>
                  <td className="py-3 font-medium">
                    {formatCurrency(price, currency)}
                    {sub.plan?.interval && `/${sub.plan.interval}`}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {sub.currentPeriodStart && sub.currentPeriodEnd ? (
                      <div className="text-xs">
                        <div>
                          {format(new Date(sub.currentPeriodStart), "MMM d, yyyy")}
                        </div>
                        <div className="text-muted-foreground">to</div>
                        <div>
                          {format(new Date(sub.currentPeriodEnd), "MMM d, yyyy")}
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-3">
                    {sub.cancelAtPeriodEnd ? (
                      <span className="text-destructive">Yes</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
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

