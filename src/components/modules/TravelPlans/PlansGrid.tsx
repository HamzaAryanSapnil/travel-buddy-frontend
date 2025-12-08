import { Skeleton } from "@/components/ui/skeleton";
import { TravelPlan } from "@/types/travelPlan.interface";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import PlanCard from "./PlanCard";
import EmptyState from "./EmptyState";
import { Search } from "lucide-react";

interface PlansGridProps {
  plans: TravelPlan[] | null;
  isLoading?: boolean;
  error?: string | null;
  isMemberMap?: Record<string, boolean>;
  isDashboard?: boolean;
}

const PlanCardSkeleton = () => (
  <Card className="overflow-hidden flex flex-col h-full">
    <Skeleton className="w-full aspect-video" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3 mt-1" />
    </CardHeader>
    <CardContent className="space-y-3 flex-1">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

const PlansGrid = ({
  plans,
  isLoading = false,
  error = null,
  isMemberMap = {},
  isDashboard = false,
}: PlansGridProps) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <PlanCardSkeleton key={index} />
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

  // Plans Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isMember={isMemberMap[plan.id] || false}
          isDashboard={isDashboard}
        />
      ))}
    </div>
  );
};

export default PlansGrid;

