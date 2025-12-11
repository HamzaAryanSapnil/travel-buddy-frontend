/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { getTravelPlan } from "@/services/travelPlans/getTravelPlan";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getTripMembers } from "@/services/tripMembers/getTripMembers";
import { getIncomingRequests } from "@/services/tripBookings/getIncomingRequests";
import { getItineraryItems } from "@/services/itinerary/getItineraryItems";
import { getMedia } from "@/services/media/getMedia";
import { getExpenses } from "@/services/expenses/getExpenses";
import { getPlanMeetups } from "@/services/meetups/getPlanMeetups";
import PlanDashboardTabs from "@/components/modules/TravelPlans/PlanDashboardTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface PlanDashboardPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlanDashboardPage({
  params,
}: PlanDashboardPageProps) {
  const { id } = await params;

  // Parallel data fetching - fetch all required data at once
  const [planResult, userInfo, membersResult, requestsResult, itineraryResult, mediaResult, expensesResult, meetupsResult] =
    await Promise.all([
      getTravelPlan(id),
      getUserInfo(),
      getTripMembers(id),
      getIncomingRequests(id),
      getItineraryItems(id),
      getMedia(id, { type: "photo" }),
      getExpenses(id),
      getPlanMeetups(id),
    ]);


  if (!planResult.data) {
    return (
      <Card className="p-8 text-center text-destructive">
        <h3 className="text-xl font-semibold mb-2">Error Loading Plan</h3>
        <p>
          {planResult.error ||
            "Travel plan not found or you don't have access."}
        </p>
      </Card>
    );
  }

  const plan = planResult.data;

  // Determine current user's role in the plan
  let currentUserRole = "VIEWER";

  if (userInfo && plan.ownerId === userInfo.id) {
    currentUserRole = "OWNER";
  }

  // Admin override
  if (userInfo && userInfo.role === "ADMIN") {
    currentUserRole = "ADMIN";
  }

  // Extract members and requests data
  const members = membersResult?.data || [];
  const pendingRequests =
    requestsResult?.data?.filter((req: any) => req.status === "PENDING") || [];
  const membersError = membersResult?.success
    ? null
    : membersResult?.message || null;
  const requestsError = requestsResult?.success
    ? null
    : requestsResult?.message || null;

  // Extract itinerary data - transform based on component needs
  const itineraryDays = itineraryResult?.data?.days || [];
  const itineraryTotalDays = itineraryResult?.data?.totalDays || 0;
  const itineraryError = itineraryResult?.success
    ? null
    : itineraryResult?.message || null;

  // Extract media data
  const mediaItems = mediaResult?.data || [];
  const mediaError = mediaResult?.error || null;

  // Extract expenses data
  const expenses = expensesResult?.data || [];
  const expensesError = expensesResult?.error || null;

  // Extract meetups data
  const meetups = meetupsResult?.data || [];
  const meetupsError = meetupsResult?.error || null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{plan.title}</h1>
          <p className="text-muted-foreground mt-1">Dashboard</p>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
        <PlanDashboardTabs
          plan={plan}
          currentUserId={userInfo?.id}
          currentUserRole={currentUserRole}
          members={members}
          pendingRequests={pendingRequests}
          membersError={membersError}
          requestsError={requestsError}
          itineraryDays={itineraryDays}
          itineraryTotalDays={itineraryTotalDays}
          itineraryError={itineraryError}
          mediaItems={mediaItems}
          mediaError={mediaError}
          expenses={expenses}
          expensesError={expensesError}
          meetups={meetups}
          meetupsError={meetupsError}
        />
      </Suspense>
    </div>
  );
}
