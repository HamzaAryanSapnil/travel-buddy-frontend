"use client";

import { TravelPlan } from "@/types/travelPlan.interface";
import PlansGrid from "./PlansGrid";
import PlansList from "./PlansList";

interface PlansViewContainerProps {
  plans: TravelPlan[] | null;
  isLoading?: boolean;
  error?: string | null;
  view: "grid" | "list";
  isMemberMap?: Record<string, boolean>;
  isDashboard?: boolean;
}

const PlansViewContainer = ({
  plans,
  isLoading = false,
  error = null,
  view,
  isMemberMap = {},
  isDashboard = false,
}: PlansViewContainerProps) => {
  if (view === "list") {
    return (
      <PlansList plans={plans} isLoading={isLoading} error={error} />
    );
  }

  return (
    <PlansGrid
      plans={plans}
      isLoading={isLoading}
      error={error}
      isMemberMap={isMemberMap}
      isDashboard={isDashboard}
    />
  );
};

export default PlansViewContainer;

