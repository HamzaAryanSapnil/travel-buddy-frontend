import { Suspense } from "react";
import { getCookie } from "@/services/auth/tokenHandlers";
import { getPublicTravelPlans } from "@/services/travelPlans/getPublicTravelPlans";
import TravelPlansFilters from "@/components/modules/TravelPlans/TravelPlansFilters";
import PlansGrid from "@/components/modules/TravelPlans/PlansGrid";
import Pagination from "@/components/shared/Pagination";
import { parseSortValue } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// ISR: Revalidate every 72 hours (259200 seconds) - tags are primary mechanism
export const revalidate = 259200;

interface TravelPlansPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    travelType?: string;
    isFeatured?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

const PlansGridSkeleton = () => (
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

export default async function TravelPlansPage({
  searchParams,
}: TravelPlansPageProps) {
  const params = await searchParams;
  const accessToken = await getCookie("accessToken");

  // Parse sort value
  const sortValue = params.sort || "createdAt-desc";
  const sort = parseSortValue(sortValue);

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
    isFeatured:
      params.isFeatured === "true"
        ? true
        : params.isFeatured === "false"
        ? false
        : undefined,
    sortBy: sort.sortBy as "createdAt" | "startDate" | "budgetMin",
    sortOrder: sort.sortOrder as "asc" | "desc",
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 10,
  };

  // Fetch public plans (no auth required)
  const plansData = await getPublicTravelPlans(filters);
  const error = !plansData.success ? plansData.message : null;

  // Calculate pagination
  const totalPages = Math.ceil(
    (plansData?.meta?.total || 0) / (plansData?.meta?.limit || 10)
  );
  const currentPage = plansData?.meta?.page || 1;

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            Explore Travel Plans
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing travel plans created by our community or create
            your own
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <TravelPlansFilters />
        </div>

        {/* Plans Grid */}
        <Suspense fallback={<PlansGridSkeleton />}>
          <PlansGrid
            plans={error ? null : plansData?.data || null}
            isLoading={false}
            error={error}
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

        {/* Floating Action Button (logged-in users only) */}
        {accessToken && (
          <Link
            href="/dashboard/travel-plans/create"
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              title="Create New Plan"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        )}
      </div>
    </main>
  );
}
