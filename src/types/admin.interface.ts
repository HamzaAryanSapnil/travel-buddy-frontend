import { UserInfo } from "./user.interface";
import { Subscription, SubscriptionStatus } from "./subscription.interface";
import { Payment, PaymentStatus } from "./payment.interface";
import { UserRole } from "@/lib/auth-utils";

// Admin User Management Types
export interface AdminUserFilters {
  status?: "ACTIVE" | "SUSPENDED" | "DELETED";
  role?: UserRole;
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: UserInfo[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
  data?: UserInfo;
}

// Admin Subscription Management Types
export interface AdminSubscriptionFilters {
  status?: SubscriptionStatus;
  planType?: "MONTHLY" | "YEARLY";
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AdminSubscription extends Subscription {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminSubscriptionsResponse {
  success: boolean;
  message: string;
  data: AdminSubscription[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Admin Payment Management Types
export interface AdminPaymentFilters {
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminPayment extends Payment {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  subscription?: {
    id: string;
    planType?: "MONTHLY" | "YEARLY";
  };
}

export interface AdminPaymentsResponse {
  success: boolean;
  message: string;
  data: AdminPayment[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface AdminPaymentStatistics {
  totalRevenue: number;
  currency: string;
  succeededCount: number;
  pendingCount: number;
  refundedCount: number;
  failedCount: number;
  revenueByMonth?: Array<{
    month: string;
    revenue: number;
  }>;
}

export interface AdminPaymentStatisticsResponse {
  success: boolean;
  message: string;
  data: AdminPaymentStatistics;
}

