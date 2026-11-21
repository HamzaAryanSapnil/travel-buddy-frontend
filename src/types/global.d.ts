type ActionResponse<T = null> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

type UserRole = "USER" | "ADMIN";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  fullName?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  visitedCountries?: string[];
  isVerified?: boolean;
  status?: "ACTIVE" | "SUSPENDED" | "DELETED";
  needPasswordChange?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type PaymentStatus = "SUCCEEDED" | "PENDING" | "REFUNDED" | "FAILED";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  subscriptionId?: string;
  description?: string;
}

interface PaymentsResponse {
  success: boolean;
  message: string;
  data: Payment[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

interface PaymentSummary {
  totalAmount: number;
  currency?: string;
  succeededCount: number;
  refundedCount: number;
  pendingCount: number;
}

type SubscriptionStatus =
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED"
  | "INCOMPLETE";

type SubscriptionPlanType = "MONTHLY" | "YEARLY";

interface SubscriptionPlanInfo {
  id?: string;
  name?: string;
  planType?: SubscriptionPlanType;
  price?: number;
  currency?: string;
  interval?: "month" | "year";
}

interface Subscription {
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

interface SubscriptionStatusResponse {
  success: boolean;
  message: string;
  data?: Subscription | null;
}

interface CreateSubscriptionResponse {
  success: boolean;
  message: string;
  data?: {
    subscription?: Subscription;
    checkoutUrl?: string;
    url?: string;
    sessionId?: string;
    customerId?: string;
  };
}

interface UpdateSubscriptionResponse {
  success: boolean;
  message: string;
  data?: Subscription;
}

interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: UserInfo[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
  data?: UserInfo;
}

interface VerifyUserResponse {
  success: boolean;
  message: string;
  data?: UserInfo;
}

interface UpdateUserRoleResponse {
  success: boolean;
  message: string;
  data?: UserInfo;
}

interface DeleteUserResponse {
  success: boolean;
  message: string;
}

interface AdminSubscription extends Subscription {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface AdminSubscriptionsResponse {
  success: boolean;
  message: string;
  data: AdminSubscription[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

interface AdminPayment extends Payment {
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

interface AdminPaymentsResponse {
  success: boolean;
  message: string;
  data: AdminPayment[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

interface AdminPaymentStatistics {
  totalRevenue: number;
  totalTransactions?: number;
  currency?: string;
  succeededCount?: number;
  pendingCount?: number;
  refundedCount?: number;
  failedCount?: number;
  byStatus?: Array<{
    status: "SUCCEEDED" | "PENDING" | "REFUNDED" | "FAILED";
    count: number;
    totalAmount: number;
  }>;
  byCurrency?: Array<{
    currency: string;
    count: number;
    totalAmount: number;
  }>;
  byDateRange?: {
    startDate: string;
    endDate: string;
    count: number;
    totalAmount: number;
  };
  recentPayments?: AdminPayment[];
  revenueByMonth?: Array<{
    month: string;
    revenue: number;
  }>;
}

interface AdminPaymentStatisticsResponse {
  success: boolean;
  message: string;
  data: AdminPaymentStatistics;
}

interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  travelType: "SOLO" | "COUPLE" | "FAMILY" | "FRIENDS" | "GROUP";
  budgetMin: number;
  budgetMax?: number;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  coverPhoto?: string | null;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  // Optional fields from API
  isFeatured?: boolean;
  totalDays?: number;
  _count?: {
    itineraryItems?: number;
    tripMembers?: number;
  };
  status?: "UPCOMING" | "ONGOING" | "PAST";
}

interface TravelPlansResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: TravelPlan[];
}

interface TravelPlanDetail {
  id: string;
  title: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  travelType: "SOLO" | "COUPLE" | "FAMILY" | "FRIENDS" | "GROUP";
  budgetMin: number;
  budgetMax?: number;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  coverPhoto?: string | null;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    fullName?: string;
    profileImage?: string;
  };
  _count?: {
    itineraryItems?: number;
    tripMembers?: number;
  };
  totalDays?: number;
}

interface TravelPlanResponse {
  success: boolean;
  message: string;
  data: TravelPlanDetail;
}

interface ItineraryItem {
  id: string;
  planId: string;
  dayIndex: number;
  title: string;
  description?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  locationId?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ItineraryDay {
  day: number;
  items: ItineraryItem[];
}

interface ItineraryDaysResponse {
  success: boolean;
  message: string;
  data: {
    days: ItineraryDay[];
    totalDays: number;
  };
}

interface ItineraryItemResponse {
  success: boolean;
  message: string;
  data?: ItineraryItem[];
}

interface ItineraryLocation {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
}

interface PublicItineraryItem {
  id: string;
  planId: string;
  dayIndex: number;
  startAt?: string;
  endAt?: string;
  title: string;
  description?: string;
  locationId?: string;
  order: number;
  location?: ItineraryLocation;
}

interface PublicItineraryDay {
  day: number;
  items: PublicItineraryItem[];
}

interface PublicItineraryResponse {
  success: boolean;
  message: string;
  data: {
    days: PublicItineraryDay[];
    totalDays: number;
  };
}

interface MediaItem {
  id: string;
  url: string;
  type: "photo" | "video";
  createdAt: string;
  planId?: string;
  ownerId?: string;
  provider?: string;
}

interface MediaResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: MediaItem[];
}

interface PublicGalleryItem {
  id: string;
  url: string;
  planId: string | null;
  planTitle: string | null;
  destination: string | null;
  createdAt: string;
}

interface PublicGalleryResponse {
  success: boolean;
  message: string;
  data: PublicGalleryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

/**
 * Notification type enum values from backend
 */
type NotificationType =
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

interface NotificationData {
  planId?: string;
  threadId?: string;
  messageId?: string;
  meetupId?: string;
}

/**
 * Notification interface
 */
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string | null;
  data: NotificationData | null; // Metadata (planId, threadId, messageId, etc.)
  isRead: boolean;
  createdAt: string;
}

/**
 * Notifications response with pagination
 */
interface NotificationsResponse {
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
interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

interface MarkAllAsReadResponse {
  success: boolean;
  message: string;
}

interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

interface Reviewer {
  id: string;
  fullName: string;
  avatar?: string | null;
}

interface Review {
  id: string;
  rating: number; // 1-5
  comment?: string | null;
  reviewer: Reviewer;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

interface ReviewsResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Review[];
}

interface ReviewStatistics {
  averageRating: number; // 0-5, can be decimal
  totalReviews: number;
  ratingDistribution?: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

interface ReviewStatisticsResponse {
  success: boolean;
  message: string;
  data: ReviewStatistics | null;
}

type MeetupStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED" | "PENDING";

type RSVPStatus = "ACCEPTED" | "DECLINED" | "PENDING" | "MAYBE";

interface RSVP {
  id: string;
  meetupId: string;
  userId: string;
  status: RSVPStatus;
  respondedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  user?: UserInfo;
}

interface Meetup {
  id: string;
  planId: string;
  title: string;
  description?: string | null;
  location: string;
  scheduledAt: string;
  endAt?: string | null;
  videoRoomLink?: string | null; // Google Meet link (optional)
  status: MeetupStatus;
  createdBy: string; // userId
  createdAt: string;
  updatedAt: string;
  // Relations
  plan?: TravelPlan;
  createdByUser?: UserInfo;
  rsvps?: RSVP[];
}

interface MeetupsResponse {
  success: boolean;
  message: string;
  data: Meetup[];
}

interface MeetupResponse {
  success: boolean;
  message: string;
  data?: Meetup;
}

interface RSVPResponse {
  success: boolean;
  message: string;
  data?: RSVP;
}

type ExpenseCategory =
  | "FOOD"
  | "TRANSPORT"
  | "ACCOMMODATION"
  | "ACTIVITY"
  | "SHOPPING"
  | "OTHER";

type ExpenseSplitType = "EQUAL" | "CUSTOM";

interface ExpenseSplit {
  userId: string;
  amount: number;
}

interface ExpenseSplitWithUser extends ExpenseSplit {
  user: UserInfo;
}

interface Expense {
  id: string;
  planId: string;
  title: string;
  description?: string | null;
  amount: number;
  category: ExpenseCategory;
  paidBy: string; // userId
  splitType: ExpenseSplitType;
  splits: ExpenseSplit[];
  expenseDate?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  paidByUser?: UserInfo;
  splitsWithUsers?: ExpenseSplitWithUser[];
}

// Backend response structure (raw API response)
interface BackendExpenseResponse {
  id: string;
  planId: string;
  payerId: string; // Backend uses payerId
  amount: number;
  currency?: string;
  category: ExpenseCategory;
  description?: string | null; // Backend doesn't have title, only description
  expenseDate?: string | null;
  splitType: ExpenseSplitType;
  locationId?: string | null;
  createdAt: string;
  updatedAt: string;
  payer?: UserInfo; // Backend uses payer
  participants?: Array<{
    id: string;
    expenseId: string;
    userId: string;
    amount: number;
    isPaid?: boolean;
    paidAt?: string | null;
    createdAt: string;
    updatedAt: string;
    user?: UserInfo;
  }>; // Backend uses participants instead of splits
  summary?: {
    totalAmount: number;
    participantCount: number;
    settledCount: number;
    isFullySettled: boolean;
  };
}

interface ExpensesResponse {
  success: boolean;
  message: string;
  data: Expense[] | BackendExpenseResponse[]; // Can be either format
}

interface ExpenseSummary {
  totalExpenses: number;
  totalByCategory: Record<ExpenseCategory, number>;
  memberBalances: Array<{
    userId: string;
    userName: string;
    paid: number;
    owed: number;
    balance: number;
  }>;
  settlements: Array<{
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    amount: number;
  }>;
}

interface NavItem {
  title: string;
  href: string;
  icon: string; // Icon name as string (e.g., "LayoutDashboard", "Map")
  badge?: string | number; // Optional notification badge
  description?: string;
  roles: UserRole[]; // Array of roles that can see this item
}

interface NavSection {
  title?: string; // Optional section title
  items: NavItem[];
}

// Dashboard Overview Types

interface UserDashboardStats {
  totalPlans: number;
  upcomingTrips: number;
  totalExpenses: number;
  activeSubscription: boolean;
}

interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPlans: number;
  publicPlans: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalMeetups: number;
  totalExpenses: number;
}

interface ExpenseCategoryData {
  category: "FOOD" | "TRANSPORT" | "ACCOMMODATION" | "ACTIVITY" | "SHOPPING" | "OTHER";
  amount: number;
  percentage: number;
}

interface PlansTimelineData {
  month: string; // YYYY-MM format
  count: number;
}

interface RevenueOverTimeData {
  month: string; // YYYY-MM format
  revenue: number;
}

interface PlansByTravelTypeData {
  type: "SOLO" | "COUPLE" | "FAMILY" | "FRIENDS" | "GROUP";
  count: number;
}

interface UserGrowthData {
  month: string; // YYYY-MM format
  newUsers: number;
}

interface SubscriptionStatusData {
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";
  count: number;
  percentage: number;
}

type ActivityType =
  | "PLAN_CREATED"
  | "PLAN_UPDATED"
  | "MEMBER_JOINED"
  | "MEMBER_LEFT"
  | "EXPENSE_ADDED"
  | "EXPENSE_UPDATED"
  | "EXPENSE_DELETED"
  | "MEETUP_CREATED"
  | "MEETUP_UPDATED"
  | "ITINERARY_ADDED"
  | "ITINERARY_UPDATED"
  | "USER_REGISTERED"
  | "SUBSCRIPTION_CREATED"
  | "PAYMENT_SUCCEEDED";

interface RecentActivity {
  type: ActivityType;
  message: string;
  timestamp: string;
  link?: string;
}

interface UpcomingMeetup {
  id: string;
  planTitle: string;
  location: string;
  scheduledAt: string;
  rsvpStatus: "ACCEPTED" | "DECLINED" | "PENDING";
}

interface TopPlan {
  id: string;
  title: string;
  memberCount: number;
  expenseCount: number;
  isFeatured: boolean;
}

interface UserDashboardCharts {
  expensesByCategory: ExpenseCategoryData[];
  plansTimeline: PlansTimelineData[];
}

interface AdminDashboardCharts {
  revenueOverTime: RevenueOverTimeData[];
  plansByTravelType: PlansByTravelTypeData[];
  userGrowth: UserGrowthData[];
  subscriptionStatus: SubscriptionStatusData[];
}

interface UserDashboardOverviewData {
  stats: UserDashboardStats;
  charts: UserDashboardCharts;
  recentActivity: RecentActivity[];
  upcomingMeetups: UpcomingMeetup[];
  recentNotifications: Notification[];
}

interface AdminDashboardOverviewData {
  stats: AdminDashboardStats;
  charts: AdminDashboardCharts;
  recentActivity: RecentActivity[];
  topPlans: TopPlan[];
}

interface UserDashboardOverviewResponse {
  success: boolean;
  message: string;
  data: UserDashboardOverviewData;
}

interface AdminDashboardOverviewResponse {
  success: boolean;
  message: string;
  data: AdminDashboardOverviewData;
}

type UIStep =
  | "destination"
  | "groupSize"
  | "budget"
  | "tripDuration"
  | "interests"
  | "specialRequirements"
  | "Final";

interface PromptFlowItem {
  q: string;
  a: string;
  uiStep: UIStep;
  ts: string;
}

interface FinalOutput {
  title: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  travelType: TravelPlan["travelType"];
  budgetMin: number;
  budgetMax?: number;
  description?: string;
  itinerary?: ItineraryDay[];
  estimatedCost?: number;
}

interface PlanningSession {
  id: string;
  userId: string;
  planId?: string | null;
  promptFlow: PromptFlowItem[];
  finalOutput?: FinalOutput | null;
  uiState: {
    currentStep: UIStep;
    remainingAIUses: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  planData?: PlanSuggestion;
  uiStep?: UIStep;
}

interface PlanSuggestion {
  title: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  travelType: TravelPlan["travelType"];
  budgetMin: number;
  budgetMax?: number;
  description?: string;
  itinerary?: ItineraryDay[];
  estimatedCost?: number;
}

interface PlannerState {
  messages: ChatMessage[];
  currentSuggestion?: PlanSuggestion;
  isLoading: boolean;
  sessionId?: string;
  currentStep?: UIStep;
  remainingAIUses?: number;
}

interface PlannerResponse {
  success: boolean;
  message: string;
  data?: {
    id?: string; // sessionId
    question?: string;
    uiStep?: UIStep;
    remainingAIUses?: number;
    suggestion?: PlanSuggestion;
    response?: string;
    planId?: string;
  };
}

interface PlanningSessionsResponse {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: PlanningSession[];
}

/**
 * PROJECT CONFIGURATION INTERFACE
 *
 * TypeScript interface for project configuration.
 * এই file সব প্রোজেক্টে একই থাকবে।
 *
 * File Location: src/types/project.interface.ts
 */

interface ProjectConfig {
  // Basic Info
  projectName: string;
  projectTagline: string;
  projectDescription: string;

  // Mission & Vision
  mission: {
    title: string;
    description: string;
    problemsSolved: Array<{
      title: string;
      description: string;
    }>;
  };

  // Overview
  overview: {
    paragraphs: string[];
  };

  // Features (Role-based)
  features: {
    admin?: Array<{
      title: string;
      description: string;
      icon: string; // Lucide icon name
    }>;
    user?: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    // Add more roles as needed
    [key: string]: Array<{
      title: string;
      description: string;
      icon: string;
    }> | undefined;
  };

  // Technology Stack
  techStack: {
    frontend: string[];
    backend: string[];
    services: string[];
  };

  // GitHub Repositories (Project-specific)
  repositories: {
    frontend?: {
      name: string;
      description: string;
      url: string;
    };
    backend?: {
      name: string;
      description: string;
      url: string;
    };
    // Add more repos as needed
    [key: string]: {
      name: string;
      description: string;
      url: string;
    } | undefined;
  };

  // Homepage About Section
  homepageAbout: {
    smallHeading: string;
    mainHeading: string;
    subDescription: string;
    bulletPoints: string[];
    sinceYear: string;
    sinceDescription: string;
    aboutImage: string;
    learnMoreLink: string;
  };
}

type BookingStatus = "PENDING" | "APPROVED" | "REJECTED";

interface TripBooking {
  id: string;
  planId: string;
  userId: string;
  status: BookingStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  plan?: TravelPlan;
  user?: UserInfo;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data: TripBooking;
}

interface MyBookingsResponse {
  success: boolean;
  message: string;
  data: TripBooking[];
}

interface PlanBookingsResponse {
  success: boolean;
  message: string;
  data: TripBooking[];
}

type TripRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: TripRole;
  createdAt: string;
  updatedAt: string;
  user: UserInfo;
}

interface TripMembersResponse {
  success: boolean;
  message: string;
  data: TripMember[];
}
