import { Suspense } from "react";
import { getAdminDashboardOverview } from "@/services/dashboard/getAdminDashboardOverview";
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
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </Card>
      ))}
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </Card>
      ))}
    </div>
  </div>
);

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
        <Suspense fallback={<DashboardSkeleton />}>
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

