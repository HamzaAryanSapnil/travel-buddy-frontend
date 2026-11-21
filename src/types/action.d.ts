interface PaymentFilters {
  status?: string;
  subscriptionId?: string;
  page?: number;
  limit?: number;
}

interface AdminUserFilters {
  status?: "ACTIVE" | "SUSPENDED" | "DELETED";
  role?: UserRole;
  searchTerm?: string;
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface AdminSubscriptionFilters {
  status?: SubscriptionStatus;
  planType?: "MONTHLY" | "YEARLY";
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface AdminPaymentFilters {
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  userId?: string;
  subscriptionId?: string;
  currency?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface AdminTravelPlansFilters {
  searchTerm?: string;
  travelType?: "SOLO" | "COUPLE" | "FAMILY" | "FRIENDS" | "GROUP";
  visibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
  isFeatured?: boolean;
  ownerId?: string;
  sortBy?: "createdAt" | "startDate" | "budgetMin";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface TravelPlansFilters {
  searchTerm?: string;
  travelType?: "SOLO" | "COUPLE" | "FAMILY" | "FRIENDS" | "GROUP";
  visibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
  isFeatured?: boolean;
  type?: "future" | "past"; // Filter by date: future (startDate >= today) or past (endDate < today)
  sortBy?: "createdAt" | "startDate" | "budgetMin";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface GetMediaFilters {
  limit?: number;
  type?: "photo" | "video";
}

interface GetMeetupsFilters {
  planId?: string;
  status?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  startDate?: string;
  endDate?: string;
}

interface GetNotificationsFilters {
  isRead?: boolean;
  type?: NotificationType;
  page?: number;
  limit?: number;
}

interface GetReviewsFilters {
  planId: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface GetExpensesFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}
