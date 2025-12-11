export type PaymentStatus = "SUCCEEDED" | "PENDING" | "REFUNDED" | "FAILED";

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  subscriptionId?: string;
  description?: string;
}

export interface PaymentsResponse {
  success: boolean;
  message: string;
  data: Payment[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaymentSummary {
  totalAmount: number;
  currency?: string;
  succeededCount: number;
  refundedCount: number;
  pendingCount: number;
}

