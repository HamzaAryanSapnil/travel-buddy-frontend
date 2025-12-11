export type SubscriptionStatus =
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED"
  | "INCOMPLETE";

export type SubscriptionPlanType = "MONTHLY" | "YEARLY";

export interface SubscriptionPlanInfo {
  id?: string;
  name?: string;
  planType?: SubscriptionPlanType;
  price?: number;
  currency?: string;
  interval?: "month" | "year";
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  planType?: SubscriptionPlanType;
  currentPeriodEnd?: string;
  currentPeriodStart?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt?: string;
  updatedAt?: string;
  plan?: SubscriptionPlanInfo;
}

export interface SubscriptionStatusResponse {
  success: boolean;
  message: string;
  data?: Subscription | null;
}

export interface CreateSubscriptionResponse {
  success: boolean;
  message: string;
  data?: {
    subscription?: Subscription;
    checkoutUrl?: string; // Legacy support
    url?: string; // Stripe checkout URL (backend returns this)
    sessionId?: string;
    customerId?: string;
  };
}

export interface UpdateSubscriptionResponse {
  success: boolean;
  message: string;
  data?: Subscription;
}
