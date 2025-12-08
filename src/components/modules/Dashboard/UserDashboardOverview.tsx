import { Suspense } from "react";
import { UserDashboardOverviewData } from "@/types/dashboard.interface";
import StatCard from "./StatCard";
import ExpenseCategoryChart from "./ExpenseCategoryChart";
import PlansTimelineChart from "./PlansTimelineChart";
import RecentActivity from "./RecentActivity";
import UpcomingMeetups from "./UpcomingMeetups";
import RecentNotifications from "./RecentNotifications";
import { Map, Calendar, DollarSign, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface UserDashboardOverviewProps {
  overview: UserDashboardOverviewData;
}

const ChartSkeleton = () => (
  <Card>
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  </Card>
);

const UserDashboardOverview = ({ overview }: UserDashboardOverviewProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Travel Buddy dashboard
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          value={overview.stats.totalPlans}
          label="Travel Plans"
          icon={Map}
          href="/dashboard/travel-plans"
          color="blue"
        />
        <StatCard
          value={overview.stats.upcomingTrips}
          label="Upcoming Trips"
          icon={Calendar}
          href="/dashboard/travel-plans?type=future"
          color="green"
        />
        <StatCard
          value={formatCurrency(overview.stats.totalExpenses)}
          label="Total Expenses"
          icon={DollarSign}
          href="/dashboard/expenses"
          color="orange"
        />
        <StatCard
          value={overview.stats.activeSubscription ? "Active" : "Inactive"}
          label="Subscription"
          icon={CreditCard}
          href="/dashboard/subscriptions"
          color="purple"
          badge={overview.stats.activeSubscription ? "Active" : "Inactive"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <ExpenseCategoryChart data={overview.charts.expensesByCategory} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <PlansTimelineChart data={overview.charts.plansTimeline} />
        </Suspense>
      </div>

      {/* Recent Activity and Upcoming Meetups */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity activities={overview.recentActivity} />
        <UpcomingMeetups meetups={overview.upcomingMeetups} />
      </div>

      {/* Recent Notifications */}
      <RecentNotifications notifications={overview.recentNotifications} />
    </div>
  );
};

export default UserDashboardOverview;

