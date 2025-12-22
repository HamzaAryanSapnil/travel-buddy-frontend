import UserDashboardSkeleton from "@/components/modules/Dashboard/UserDashboardSkeleton";

export default function DashboardLoading() {
  // Show user dashboard skeleton by default
  // Admin dashboard will show AdminDashboardSkeleton when data loads
  return <UserDashboardSkeleton />;
}

