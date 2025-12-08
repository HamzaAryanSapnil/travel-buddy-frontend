import { Suspense } from "react";
import { AdminDashboardOverviewData } from "@/types/dashboard.interface";
import StatCard from "./StatCard";
import RevenueOverTimeChart from "./RevenueOverTimeChart";
import PlansByTravelTypeChart from "./PlansByTravelTypeChart";
import UserGrowthChart from "./UserGrowthChart";
import SubscriptionStatusChart from "./SubscriptionStatusChart";
import RecentActivity from "./RecentActivity";
import TopPlans from "./TopPlans";
import {
  Users,
  UserCheck,
  Map,
  Globe,
  DollarSign,
  CreditCard,
  Calendar,
  Receipt,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface AdminDashboardOverviewProps {
  overview: AdminDashboardOverviewData;
}

const ChartSkeleton = () => (
  <Card>
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  </Card>
);

const AdminDashboardOverview = ({ overview }: AdminDashboardOverviewProps) => {
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and analytics
        </p>
      </div>

      {/* Stat Cards - 8 cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          value={overview.stats.totalUsers}
          label="Total Users"
          icon={Users}
          href="/admin/dashboard/users"
          color="blue"
        />
        <StatCard
          value={overview.stats.activeUsers}
          label="Active Users"
          icon={UserCheck}
          href="/admin/dashboard/users?active=true"
          color="green"
        />
        <StatCard
          value={overview.stats.totalPlans}
          label="Total Plans"
          icon={Map}
          href="/admin/dashboard/travel-plans"
          color="purple"
        />
        <StatCard
          value={overview.stats.publicPlans}
          label="Public Plans"
          icon={Globe}
          href="/admin/dashboard/travel-plans?visibility=PUBLIC"
          color="teal"
        />
        <StatCard
          value={formatCurrency(overview.stats.totalRevenue)}
          label="Total Revenue"
          icon={DollarSign}
          href="/admin/dashboard/payments"
          color="green"
        />
        <StatCard
          value={overview.stats.activeSubscriptions}
          label="Active Subscriptions"
          icon={CreditCard}
          href="/admin/dashboard/subscriptions"
          color="orange"
        />
        <StatCard
          value={overview.stats.totalMeetups}
          label="Total Meetups"
          icon={Calendar}
          href="/admin/dashboard/meetups"
          color="pink"
        />
        <StatCard
          value={formatCurrency(overview.stats.totalExpenses)}
          label="Total Expenses"
          icon={Receipt}
          href="/admin/dashboard/expenses"
          color="red"
        />
      </div>

      {/* Charts Section - 4 charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueOverTimeChart data={overview.charts.revenueOverTime} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <PlansByTravelTypeChart data={overview.charts.plansByTravelType} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <UserGrowthChart data={overview.charts.userGrowth} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <SubscriptionStatusChart data={overview.charts.subscriptionStatus} />
        </Suspense>
      </div>

      {/* Recent Activity and Top Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity activities={overview.recentActivity} />
        <TopPlans plans={overview.topPlans} />
      </div>
    </div>
  );
};

export default AdminDashboardOverview;

