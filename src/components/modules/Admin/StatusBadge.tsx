import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types/payment.interface";
import { SubscriptionStatus } from "@/types/subscription.interface";

type Variant = "default" | "secondary" | "destructive" | "outline";

const userStatusMap: Record<"ACTIVE" | "SUSPENDED" | "DELETED", Variant> = {
  ACTIVE: "default",
  SUSPENDED: "destructive",
  DELETED: "secondary",
};

const subStatusMap: Record<SubscriptionStatus, Variant> = {
  ACTIVE: "default",
  PAST_DUE: "destructive",
  CANCELLED: "secondary",
  EXPIRED: "secondary",
  INCOMPLETE: "outline",
};

const payStatusMap: Record<PaymentStatus, Variant> = {
  SUCCEEDED: "default",
  PENDING: "outline",
  REFUNDED: "secondary",
  FAILED: "destructive",
};

export function UserStatusBadge({
  status,
}: {
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
}) {
  return <Badge variant={userStatusMap[status] || "outline"}>{status}</Badge>;
}

export function SubscriptionStatusBadge({
  status,
}: {
  status: SubscriptionStatus;
}) {
  return <Badge variant={subStatusMap[status] || "outline"}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={payStatusMap[status] || "outline"}>{status}</Badge>;
}

