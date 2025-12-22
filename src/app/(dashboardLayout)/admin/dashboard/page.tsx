import { Suspense } from "react";
import { getAdminDashboardOverview } from "@/services/dashboard/getAdminDashboardOverview";
import AdminDashboardOverview from "@/components/modules/Dashboard/AdminDashboardOverview";
import AdminDashboardSkeleton from "@/components/modules/Dashboard/AdminDashboardSkeleton";
import { Card } from "@/components/ui/card";

export const revalidate = 0; // Revalidate on every request for dashboard data

export default async function AdminDashboardPage() {
  let adminOverview: Awaited<
    ReturnType<typeof getAdminDashboardOverview>
  > | null = null;
  let fatalError = false;

  try {
    adminOverview = await getAdminDashboardOverview();
  } catch (error) {
    console.error("Admin dashboard page error:", error);
    fatalError = true;
  }

  if (fatalError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System overview and analytics
          </p>
        </div>
        <Card className="p-6">
          <p className="text-destructive">
            An error occurred while loading the admin dashboard. Please try again
            later.
          </p>
        </Card>
      </div>
    );
  }

  if (adminOverview?.success) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<AdminDashboardSkeleton />}>
          <AdminDashboardOverview overview={adminOverview.data} />
        </Suspense>
      </div>
    );
  }

  // Fallback if API call fails
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and analytics
        </p>
      </div>
      <Card className="p-6">
        <p className="text-muted-foreground">
          Unable to load admin dashboard data. Please try refreshing the page.
        </p>
      </Card>
    </div>
  );
}

