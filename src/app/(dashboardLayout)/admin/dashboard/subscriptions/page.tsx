import { getAllSubscriptions } from "@/services/admin/getAllSubscriptions";
import SubscriptionsTable from "@/components/modules/Admin/SubscriptionsTable";
import SubscriptionsFilters from "@/components/modules/Admin/SubscriptionsFilters";
import AdminPageHeader from "@/components/modules/Admin/AdminPageHeader";
import Pagination from "@/components/shared/Pagination";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminSubscriptionsPageProps {
  searchParams: Promise<{
    status?: string;
    planType?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminSubscriptionsPage({
  searchParams,
}: AdminSubscriptionsPageProps) {
  const params = await searchParams;

  // Build filters object
  const filters = {
    status:
      params.status && params.status !== "all"
        ? (params.status as
            | "ACTIVE"
            | "PAST_DUE"
            | "CANCELLED"
            | "EXPIRED"
            | "INCOMPLETE")
        : undefined,
    planType:
      params.planType && params.planType !== "all"
        ? (params.planType as "MONTHLY" | "YEARLY")
        : undefined,
    startDate: params.startDate,
    endDate: params.endDate,
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 20,
  };

  // Fetch subscriptions
  let subscriptionsData;
  let error: string | null = null;

  try {
    subscriptionsData = await getAllSubscriptions(filters);
    if (!subscriptionsData.success) {
      error = subscriptionsData.message;
    }
  } catch (err: any) {
    error = err.message || "Failed to load subscriptions";
    subscriptionsData = {
      success: false,
      message: error,
      meta: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total: 0,
      },
      data: [],
    };
  }

  // Calculate pagination
  const totalPages = Math.ceil(
    (subscriptionsData?.meta?.total || 0) / (subscriptionsData?.meta?.limit || 20)
  );
  const currentPage = subscriptionsData?.meta?.page || 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminPageHeader
        title="All Subscriptions"
        description="View and manage all subscriptions in the system"
        stats={[
          {
            label: "Total Subscriptions",
            value: subscriptionsData?.meta?.total || 0,
          },
        ]}
      />

      {/* Filters */}
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <SubscriptionsFilters />
      </Suspense>

      {/* Subscriptions Table */}
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <SubscriptionsTable
          subscriptions={error ? [] : subscriptionsData?.data || []}
          error={error}
        />
      </Suspense>

      {/* Pagination */}
      {!error && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={subscriptionsData?.meta?.total || 0}
            itemsPerPage={filters.limit}
          />
        </div>
      )}
    </div>
  );
}

