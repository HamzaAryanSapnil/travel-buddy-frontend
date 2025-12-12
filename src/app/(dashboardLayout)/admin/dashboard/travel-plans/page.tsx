import { getAdminTravelPlans } from "@/services/admin/getAdminTravelPlans";
import AdminTravelPlansView from "@/components/modules/Admin/AdminTravelPlansView";
import AdminPageHeader from "@/components/modules/Admin/AdminPageHeader";
import AdminTravelPlansFilters from "@/components/modules/Admin/AdminTravelPlansFilters";
import ViewToggle from "@/components/shared/ViewToggle";
import Pagination from "@/components/shared/Pagination";
import { parseSortValue } from "@/lib/formatters";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminTravelPlansFilters as AdminTravelPlansFiltersType } from "@/types/admin.interface";

interface AdminTravelPlansPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    travelType?: string;
    visibility?: string;
    isFeatured?: string;
    ownerId?: string;
    type?: string;
    sort?: string;
    page?: string;
    limit?: string;
    view?: string;
  }>;
}

export default async function AdminTravelPlansPage({
  searchParams,
}: AdminTravelPlansPageProps) {
  const params = await searchParams;

  // Parse sort value
  const sortValue = params.sort || "createdAt-desc";
  const sort = parseSortValue(sortValue);

  // Get view preference (default: grid)
  const view = (params.view || "grid") as "grid" | "list";

  // Build filters object
  const filters: AdminTravelPlansFiltersType = {
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
      params.isFeatured === "true" ? true : params.isFeatured === "false" ? false : undefined,
    ownerId: params.ownerId || undefined,
    sortBy: sort.sortBy as "createdAt" | "startDate" | "budgetMin",
    sortOrder: sort.sortOrder as "asc" | "desc",
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 12,
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
        limit: filters.limit || 12,
        total: 0,
      },
      data: [],
    };
  }

  // Calculate pagination
  const totalPages = Math.ceil(
    (plansData?.meta?.total || 0) / (plansData?.meta?.limit || 12)
  );
  const currentPage = plansData?.meta?.page || 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminPageHeader
        title="All Travel Plans"
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
        <AdminTravelPlansFilters />
      </Suspense>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {plansData?.meta?.total || 0} plan
          {(plansData?.meta?.total || 0) !== 1 ? "s" : ""} found
        </div>
        <ViewToggle />
      </div>

      {/* Plans Display */}
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <AdminTravelPlansView
          plans={error ? null : plansData?.data || null}
          error={error}
          view={view}
          isAdminView={true}
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

