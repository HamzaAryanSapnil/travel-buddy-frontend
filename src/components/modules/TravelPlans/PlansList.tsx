import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { TravelPlan } from "@/types/travelPlan.interface";
import EmptyState from "./EmptyState";
import PlanListItem from "./PlanListItem";
import { Search } from "lucide-react";

interface PlansListProps {
  plans: TravelPlan[] | null;
  isLoading?: boolean;
  error?: string | null;
  isAdminView?: boolean;
}

const PlanListItemSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Image Skeleton */}
      <Skeleton className="w-full md:w-48 h-48 md:aspect-square rounded-lg flex-shrink-0" />
      
      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  </Card>
);

const PlansList = ({
  plans,
  isLoading = false,
  error = null,
  isAdminView = false,
}: PlansListProps) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <PlanListItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <EmptyState
        title="Error loading plans"
        description={error}
        icon={<Search className="h-16 w-16 text-destructive" />}
      />
    );
  }

  // Empty State
  if (!plans || plans.length === 0) {
    return (
      <EmptyState
        title="No travel plans found"
        description="Try adjusting your filters or create a new plan!"
        action={{
          label: "Create Your First Plan",
          href: "/dashboard/travel-plans/create",
        }}
      />
    );
  }

  // Plans List
  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <PlanListItem key={plan.id} plan={plan} isAdminView={isAdminView} />
      ))}
    </div>
  );
};

export default PlansList;

