import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subscription } from "@/types/subscription.interface";
import { SubscriptionStatusBadge } from "./StatusBadge";
import SubscriptionActions from "./SubscriptionActions";
import { format, differenceInDays } from "date-fns";

interface SubscriptionPanelProps {
  subscription?: Subscription;
  onSubscribe?: (planType: "MONTHLY" | "YEARLY") => void;
  isPending?: boolean;
}

export default function SubscriptionPanel({
  subscription,
  onSubscribe,
  isPending,
}: SubscriptionPanelProps) {
  // Only show subscription details if we have a valid subscription with an ID
  const hasActive = !!subscription && !!subscription.id;

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!subscription?.currentPeriodEnd) return null;
    const endDate = new Date(subscription.currentPeriodEnd);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const days = differenceInDays(endDate, today);
    return days >= 0 ? days : 0;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!hasActive ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You don&apos;t have an active subscription. Choose a plan below to get started.
            </p>
            <SubscriptionActions
              hasActiveSubscription={false}
              onSubscribe={onSubscribe}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <SubscriptionStatusBadge status={subscription.status} />
            </div>
            {subscription.plan && (
              <div className="text-sm">
                Plan:{" "}
                <span className="font-medium text-foreground">
                  {subscription.plan.name} ({subscription.plan.planType})
                </span>
              </div>
            )}
            <div className="text-sm">
              Current period ends:{" "}
              <span className="font-medium text-foreground">
                {subscription.currentPeriodEnd
                  ? format(new Date(subscription.currentPeriodEnd), "PPP")
                  : "N/A"}
              </span>
            </div>
            {daysRemaining !== null && (
              <div className="text-sm">
                Days remaining:{" "}
                <span className="font-medium text-foreground">
                  {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
                </span>
              </div>
            )}
            <div className="text-sm">
              Cancel at period end:{" "}
              <span className="font-medium text-foreground">
                {subscription.cancelAtPeriodEnd ? "Yes" : "No"}
              </span>
            </div>
            <SubscriptionActions
              subscriptionId={subscription.id}
              hasActiveSubscription={hasActive}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
