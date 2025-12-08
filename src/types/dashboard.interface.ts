import { UserRole } from "@/lib/auth-utils";

export interface NavItem {
  title: string;
  href: string;
  icon: string; // Icon name as string (e.g., "LayoutDashboard", "Map")
  badge?: string | number; // Optional notification badge
  description?: string;
  roles: UserRole[]; // Array of roles that can see this item
}

export interface NavSection {
  title?: string; // Optional section title
  items: NavItem[];
}

// Dashboard Overview Types

export interface UserDashboardStats {
  totalPlans: number;
  upcomingTrips: number;
  totalExpenses: number;
  activeSubscription: boolean;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPlans: number;
  publicPlans: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalMeetups: number;
  totalExpenses: number;
}

export interface ExpenseCategoryData {
  category: "FOOD" | "TRANSPORT" | "ACCOMMODATION" | "ACTIVITY" | "SHOPPING" | "OTHER";
  amount: number;
  percentage: number;
}

export interface PlansTimelineData {
  month: string; // YYYY-MM format
  count: number;
}

export interface RevenueOverTimeData {
  month: string; // YYYY-MM format
  revenue: number;
}

export interface PlansByTravelTypeData {
  type: "SOLO" | "COUPLE" | "FAMILY" | "FRIENDS" | "GROUP";
  count: number;
}

export interface UserGrowthData {
  month: string; // YYYY-MM format
  newUsers: number;
}

export interface SubscriptionStatusData {
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";
  count: number;
  percentage: number;
}

export type ActivityType =
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

export interface RecentActivity {
  type: ActivityType;
  message: string;
  timestamp: string;
  link?: string;
}

export interface UpcomingMeetup {
  id: string;
  planTitle: string;
  location: string;
  scheduledAt: string;
  rsvpStatus: "ACCEPTED" | "DECLINED" | "PENDING";
}

export interface TopPlan {
  id: string;
  title: string;
  memberCount: number;
  expenseCount: number;
  isFeatured: boolean;
}

export interface UserDashboardCharts {
  expensesByCategory: ExpenseCategoryData[];
  plansTimeline: PlansTimelineData[];
}

export interface AdminDashboardCharts {
  revenueOverTime: RevenueOverTimeData[];
  plansByTravelType: PlansByTravelTypeData[];
  userGrowth: UserGrowthData[];
  subscriptionStatus: SubscriptionStatusData[];
}

export interface UserDashboardOverviewData {
  stats: UserDashboardStats;
  charts: UserDashboardCharts;
  recentActivity: RecentActivity[];
  upcomingMeetups: UpcomingMeetup[];
  recentNotifications: any[]; // Reuse Notification type from notification.interface.ts
}

export interface AdminDashboardOverviewData {
  stats: AdminDashboardStats;
  charts: AdminDashboardCharts;
  recentActivity: RecentActivity[];
  topPlans: TopPlan[];
}

export interface UserDashboardOverviewResponse {
  success: boolean;
  message: string;
  data: UserDashboardOverviewData;
}

export interface AdminDashboardOverviewResponse {
  success: boolean;
  message: string;
  data: AdminDashboardOverviewData;
}

