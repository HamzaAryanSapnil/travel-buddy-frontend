import { TravelPlan } from "@/types/travelPlan.interface";
import PlansViewContainer from "@/components/modules/TravelPlans/PlansViewContainer";
import { Card } from "@/components/ui/card";

interface AdminTravelPlansViewProps {
  plans: TravelPlan[] | null;
  error?: string | null;
  view?: "grid" | "list";
  isAdminView?: boolean;
}

export default function AdminTravelPlansView({
  plans,
  error,
  view = "grid",
  isAdminView = true,
}: AdminTravelPlansViewProps) {
  if (error) {
    return (
      <Card className="p-6 text-center text-destructive">
        Error loading travel plans: {error}
      </Card>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No travel plans found.
      </Card>
    );
  }

  return (
    <PlansViewContainer
      plans={plans}
      isLoading={false}
      error={error}
      view={view}
      isDashboard={true}
      isAdminView={isAdminView}
    />
  );
}

