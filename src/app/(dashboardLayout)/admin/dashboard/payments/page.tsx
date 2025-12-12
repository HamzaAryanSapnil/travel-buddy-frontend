/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAdminPayments,
  getAdminPaymentStatistics,
} from "@/services/admin/getAdminPayments";
import PaymentStatistics from "@/components/modules/Admin/PaymentStatistics";
import AdminPaymentsTable from "@/components/modules/Admin/AdminPaymentsTable";
import PaymentsFilters from "@/components/modules/Admin/PaymentsFilters";
import AdminPageHeader from "@/components/modules/Admin/AdminPageHeader";
import Pagination from "@/components/shared/Pagination";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminPaymentsPageProps {
  searchParams: Promise<{
    status?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
    subscriptionId?: string;
    currency?: string;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  const params = await searchParams;

  // Build filters object
  const filters = {
    status:
      params.status && params.status !== "all"
        ? (params.status as "SUCCEEDED" | "PENDING" | "REFUNDED" | "FAILED")
        : undefined,
    startDate: params.startDate,
    endDate: params.endDate,
    userId: params.userId,
    subscriptionId: params.subscriptionId,
    currency: params.currency,
    search: params.search,
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 20,
  };

  // Fetch payments and statistics in parallel
  const [paymentsData, statisticsData] = await Promise.all([
    (async () => {
      try {
        return await getAdminPayments(filters);
      } catch (err: any) {
        return {
          success: false,
          message: err.message || "Failed to load payments",
          meta: {
            page: filters.page || 1,
            limit: filters.limit || 20,
            total: 0,
          },
          data: [],
        };
      }
    })(),
    getAdminPaymentStatistics({
      startDate: filters.startDate,
      endDate: filters.endDate,
      subscriptionId: filters.subscriptionId,
      currency: filters.currency,
    }),
  ]);

  const error = paymentsData.success ? null : paymentsData.message;
  const statisticsError = statisticsData?.error || null;

  // Calculate pagination
  const totalPages = Math.ceil(
    (paymentsData?.meta?.total || 0) / (paymentsData?.meta?.limit || 20)
  );
  const currentPage = paymentsData?.meta?.page || 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminPageHeader
        title="Payment Statistics"
        description="View payment statistics and history"
      />

      {/* Payment Statistics */}
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <PaymentStatistics
          statistics={statisticsData?.data || null}
          error={statisticsError}
        />
      </Suspense>

      {/* Filters */}
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <PaymentsFilters />
      </Suspense>

      {/* Payments Table */}
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <AdminPaymentsTable
          payments={error ? [] : paymentsData?.data || []}
          error={error}
        />
      </Suspense>

      {/* Pagination */}
      {!error && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={paymentsData?.meta?.total || 0}
            itemsPerPage={filters.limit}
          />
        </div>
      )}
    </div>
  );
}
