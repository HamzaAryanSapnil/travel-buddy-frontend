import { Suspense } from "react";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getDashboardOverview } from "@/services/dashboard/getDashboardOverview";
import { getAdminDashboardOverview } from "@/services/dashboard/getAdminDashboardOverview";
import UserDashboardOverview from "@/components/modules/Dashboard/UserDashboardOverview";
import AdminDashboardOverview from "@/components/modules/Dashboard/AdminDashboardOverview";
import UserDashboardSkeleton from "@/components/modules/Dashboard/UserDashboardSkeleton";
import AdminDashboardSkeleton from "@/components/modules/Dashboard/AdminDashboardSkeleton";
import { Card } from "@/components/ui/card";

export const revalidate = 0; // Revalidate on every request for dashboard data

export default async function DashboardPage() {
  let isAdmin = false;
  let adminOverview: Awaited<
    ReturnType<typeof getAdminDashboardOverview>
  > | null = null;
  let userOverview: Awaited<ReturnType<typeof getDashboardOverview>> | null =
    null;
  let fatalError = false;

  try {
    const userInfo = await getUserInfo();
    isAdmin = userInfo.role === "ADMIN";

    if (isAdmin) {
      adminOverview = await getAdminDashboardOverview();
    } else {
      userOverview = await getDashboardOverview();
    }
  } catch (error) {
    console.error("Dashboard page error:", error);
    fatalError = true;
  }

  if (fatalError) {
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
            An error occurred while loading the dashboard. Please try again
            later.
          </p>
        </Card>
      </div>
    );
  }

  if (isAdmin && adminOverview?.success) {
    return (
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboardOverview overview={adminOverview.data} />
      </Suspense>
    );
  }

  if (!isAdmin && userOverview?.success) {
    return (
      <Suspense fallback={<UserDashboardSkeleton />}>
        <UserDashboardOverview overview={userOverview.data} />
      </Suspense>
    );
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
}
