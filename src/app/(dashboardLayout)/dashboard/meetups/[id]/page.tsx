import { Suspense } from "react";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getMeetup } from "@/services/meetups/getMeetup";
import { getTravelPlan } from "@/services/travelPlans/getTravelPlan";
import MeetupDetail from "@/components/modules/Meetups/MeetupDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface MeetupDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetupDetailPage({
  params,
}: MeetupDetailPageProps) {
  const { id } = await params;
  const userInfo = await getUserInfo();

  // Fetch meetup and plan data in parallel
  const [meetupResult, planResult] = await Promise.all([
    getMeetup(id),
    // We'll fetch plan after we get meetup data
    Promise.resolve({ data: undefined, error: null }),
  ]);

  if (!meetupResult.data) {
    if (meetupResult.error === "Meetup not found") {
      notFound();
    }
    return (
      <Card className="p-6 text-center text-destructive">
        <p>Error: {meetupResult.error || "Failed to load meetup"}</p>
      </Card>
    );
  }

  const meetup = meetupResult.data;

  // Fetch plan if planId exists
  let plan = undefined;
  if (meetup.planId) {
    const planData = await getTravelPlan(meetup.planId);
    plan = planData.data || undefined;
  }

  // Determine current user's role
  let currentUserRole = "VIEWER";
  if (userInfo && plan) {
    if (plan.ownerId === userInfo.id) {
      currentUserRole = "OWNER";
    }
    if (userInfo.role === "ADMIN") {
      currentUserRole = "ADMIN";
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
        <MeetupDetail
          meetup={meetup}
          currentUserId={userInfo?.id}
          currentUserRole={currentUserRole}
          plan={plan}
        />
      </Suspense>
    </div>
  );
}

