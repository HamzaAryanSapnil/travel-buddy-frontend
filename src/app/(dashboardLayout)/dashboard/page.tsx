import { Suspense } from "react";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getDashboardOverview } from "@/services/dashboard/getDashboardOverview";
import { getAdminDashboardOverview } from "@/services/dashboard/getAdminDashboardOverview";
import UserDashboardOverview from "@/components/modules/Dashboard/UserDashboardOverview";
import AdminDashboardOverview from "@/components/modules/Dashboard/AdminDashboardOverview";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const revalidate = 0; // Revalidate on every request for dashboard data

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-9 w-48 mb-2" />
      <Skeleton className="h-5 w-64" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </Card>
      ))}
    </div>
  </div>
);

export default async function DashboardPage() {
  try {
    const userInfo = await getUserInfo();
    const isAdmin = userInfo.role === "ADMIN";

    if (isAdmin) {
      const adminOverview = await getAdminDashboardOverview();
      if (adminOverview.success) {
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <AdminDashboardOverview overview={adminOverview.data} />
          </Suspense>
        );
      }
    } else {
      const userOverview = await getDashboardOverview();
      if (userOverview.success) {
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <UserDashboardOverview overview={userOverview.data} />
          </Suspense>
        );
      }
    }

    // Fallback if API calls fail
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Travel Buddy dashboard
          </p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">
            Unable to load dashboard data. Please try refreshing the page.
          </p>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Dashboard page error:", error);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Travel Buddy dashboard
          </p>
        </div>
        <Card className="p-6">
          <p className="text-destructive">
            An error occurred while loading the dashboard. Please try again later.
          </p>
        </Card>
      </div>
    );
  }
}

