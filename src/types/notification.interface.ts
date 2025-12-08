/**
 * Notification type enum values from backend
 */
export type NotificationType =
  | "PLAN_UPDATED"
  | "NEW_MESSAGE"
  | "MEMBER_JOINED"
  | "MEMBER_LEFT"
  | "ITINERARY_ADDED"
  | "ITINERARY_UPDATED"
  | "AI_LIMIT_REACHED"
  | "INVITATION_RECEIVED"
  | "INVITATION_ACCEPTED"
  | "MEETUP_CREATED"
  | "MEETUP_UPDATED"
  | "MEETUP_RSVP_ACCEPTED"
  | "EXPENSE_ADDED"
  | "EXPENSE_UPDATED"
  | "EXPENSE_DELETED"
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_UPDATED"
  | "SUBSCRIPTION_CANCELLED"
  | "SUBSCRIPTION_EXPIRED"
  | "PAYMENT_SUCCEEDED"
  | "PAYMENT_FAILED";

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string | null;
  data: any | null; // Metadata (planId, threadId, messageId, etc.)
  isRead: boolean;
  createdAt: string;
}

/**
 * Notifications response with pagination
 */
export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Unread count response
 */
export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

