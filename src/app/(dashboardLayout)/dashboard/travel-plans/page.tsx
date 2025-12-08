/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { getTravelPlans } from "@/services/travelPlans/getTravelPlans";
import DashboardTravelPlansFilters from "@/components/modules/TravelPlans/DashboardTravelPlansFilters";
import PlansViewContainer from "@/components/modules/TravelPlans/PlansViewContainer";
import ViewToggle from "@/components/shared/ViewToggle";
import Pagination from "@/components/shared/Pagination";
import { parseSortValue } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface MyTravelPlansPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    travelType?: string;
    visibility?: string;
    type?: string; // "future" | "past"
    sort?: string;
    page?: string;
    limit?: string;
    view?: string; // "grid" | "list"
  }>;
}

const PlansViewSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-xl border flex flex-col h-full"
      >
        <Skeleton className="w-full aspect-video" />
        <div className="p-6 space-y-3 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="p-6 pt-0">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export default async function MyTravelPlansPage({
  searchParams,
}: MyTravelPlansPageProps) {
  const params = await searchParams;

  // Parse sort value
  const sortValue = params.sort || "createdAt-desc";
  const sort = parseSortValue(sortValue);

  // Get view preference (default: grid)
  const view = (params.view || "grid") as "grid" | "list";

  // Build filters object
  const filters = {
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
    type: params.type && params.type !== "all" ? (params.type as "future" | "past") : undefined,
    sortBy: sort.sortBy as "createdAt" | "startDate" | "budgetMin",
    sortOrder: sort.sortOrder as "asc" | "desc",
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 12,
  };

  // Fetch travel plans
  let plansData;
  let error: string | null = null;

  try {
    plansData = await getTravelPlans(filters);
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            My Travel Plans
          </h1>
          <p className="text-muted-foreground">
            Manage and view all your travel plans
          </p>
        </div>
        <Button asChild size="default">
          <Link href="/dashboard/travel-plans/create">
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <DashboardTravelPlansFilters />
      </div>

      {/* View Toggle and Plans */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {plansData?.meta?.total || 0} plan
          {(plansData?.meta?.total || 0) !== 1 ? "s" : ""} found
        </div>
        <ViewToggle />
      </div>

      {/* Plans Display */}
      <Suspense fallback={<PlansViewSkeleton />}>
        <PlansViewContainer
          plans={error ? null : plansData?.data || null}
          isLoading={false}
          error={error}
          view={view}
          isDashboard={true}
        />
      </Suspense>

      {/* Pagination */}
      {!error && totalPages > 1 && (
        <div className="mt-8">
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

