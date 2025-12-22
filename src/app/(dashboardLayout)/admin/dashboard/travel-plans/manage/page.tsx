/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAdminTravelPlans } from "@/services/admin/getAdminTravelPlans";
import TravelPlansTable from "@/components/modules/Admin/TravelPlansTable";
import TravelPlansTableFilters from "@/components/modules/Admin/TravelPlansTableFilters";
import AdminPageHeader from "@/components/modules/Admin/AdminPageHeader";
import Pagination from "@/components/shared/Pagination";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminTravelPlansFilters } from "@/types/admin.interface";
import { parseSortValue } from "@/lib/formatters";

interface AdminTravelPlansManagePageProps {
  searchParams: Promise<{
    searchTerm?: string;
    travelType?: string;
    visibility?: string;
    isFeatured?: string;
    ownerId?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminTravelPlansManagePage({
  searchParams,
}: AdminTravelPlansManagePageProps) {
  const params = await searchParams;

  // Parse sort value
  const sortValue = params.sort || "createdAt-desc";
  const sort = parseSortValue(sortValue);

  // Build filters object
  const filters: AdminTravelPlansFilters = {
    searchTerm: params.searchTerm,
    travelType:
      params.travelType && params.travelType !== "all"
        ? (params.travelType as
            | "SOLO"
            | "COUPLE"
            | "FAMILY"
            | "FRIENDS"
            | "GROUP")
        : undefined,
    visibility:
      params.visibility && params.visibility !== "all"
        ? (params.visibility as "PUBLIC" | "PRIVATE" | "UNLISTED")
        : undefined,
    isFeatured:
      params.isFeatured === "true"
        ? true
        : params.isFeatured === "false"
        ? false
        : undefined,
    ownerId: params.ownerId || undefined,
    sortBy: sort.sortBy as "createdAt" | "startDate" | "budgetMin",
    sortOrder: sort.sortOrder as "asc" | "desc",
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 20,
  };

  // Fetch travel plans
  let plansData;
  let error: string | null = null;

  try {
    plansData = await getAdminTravelPlans(filters);
    if (!plansData.success) {
      error = plansData.message;
    }
  } catch (err: any) {
    error = err.message || "Failed to load travel plans";
    plansData = {
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
    (plansData?.meta?.total || 0) / (plansData?.meta?.limit || 20)
  );
  const currentPage = plansData?.meta?.page || 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminPageHeader
        title="Manage Travel Plans"
        description="View and manage all travel plans in the system"
        stats={[
          {
            label: "Total Plans",
            value: plansData?.meta?.total || 0,
          },
        ]}
      />

      {/* Filters */}
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <TravelPlansTableFilters />
      </Suspense>

      {/* Travel Plans Table */}
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <TravelPlansTable
          plans={error ? [] : plansData?.data || []}
          error={error}
        />
      </Suspense>

      {/* Pagination */}
      {!error && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={plansData?.meta?.total || 0}
            itemsPerPage={filters.limit}
          />
        </div>
      )}
    </div>
  );
}

