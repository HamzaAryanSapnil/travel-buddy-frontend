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
  isAdminView?: boolean;
}

const PlansViewContainer = ({
  plans,
  isLoading = false,
  error = null,
  view,
  isMemberMap = {},
  isDashboard = false,
  isAdminView = false,
}: PlansViewContainerProps) => {
  if (view === "list") {
    return (
      <PlansList plans={plans} isLoading={isLoading} error={error} isAdminView={isAdminView} />
    );
  }

  return (
    <PlansGrid
      plans={plans}
      isLoading={isLoading}
      error={error}
      isMemberMap={isMemberMap}
      isDashboard={isDashboard}
      isAdminView={isAdminView}
    />
  );
};

export default PlansViewContainer;

