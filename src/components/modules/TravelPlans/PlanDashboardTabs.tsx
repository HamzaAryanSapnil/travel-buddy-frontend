"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TravelPlan } from "@/types/travelPlan.interface";
import { TripMember } from "@/types/tripMembers.interface";
import { TripBooking } from "@/types/tripBooking.interface";
import { ItineraryDay } from "@/types/itinerary.interface";
import { MediaItem } from "@/types/media.interface";
import { Expense } from "@/types/expense.interface";
import { Meetup } from "@/types/meetup.interface";
import MembersTab from "./Members/MembersTab";
import ItineraryTab from "./Itinerary/ItineraryTab";
import MediaTab from "./Media/MediaTab";
import ExpensesTab from "./Expenses/ExpensesTab";
import PlanMeetupsTab from "./Meetups/PlanMeetupsTab";
import { Card, CardContent } from "@/components/ui/card";

interface PlanDashboardTabsProps {
  plan: TravelPlan;
  currentUserId?: string;
  currentUserRole?: string;
  members: TripMember[];
  pendingRequests: TripBooking[];
  membersError?: string | null;
  requestsError?: string | null;
  itineraryDays: ItineraryDay[];
  itineraryTotalDays: number;
  itineraryError?: string | null;
  mediaItems: MediaItem[];
  mediaError?: string | null;
  expenses: Expense[];
  expensesError?: string | null;
  meetups: Meetup[];
  meetupsError?: string | null;
}

export default function PlanDashboardTabs({
  plan,
  currentUserId,
  currentUserRole = "VIEWER",
  members,
  pendingRequests,
  membersError,
  requestsError,
  itineraryDays,
  itineraryTotalDays,
  itineraryError,
  mediaItems,
  mediaError,
  expenses,
  expensesError,
  meetups,
  meetupsError,
}: PlanDashboardTabsProps) {
  

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="meetups">Meetups</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Trip Overview</h3>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {plan.description || "No description provided."}
              </p>
            </CardContent>
          </Card>
          {/* Add more overview widgets here later */}
        </div>
      </TabsContent>

      <TabsContent value="itinerary">
        <ItineraryTab
          plan={plan}
          itineraryDays={itineraryDays}
          itineraryTotalDays={itineraryTotalDays}
          itineraryError={itineraryError}
          currentUserRole={currentUserRole}
        />
      </TabsContent>

      <TabsContent value="media">
        <MediaTab
          plan={plan}
          mediaItems={mediaItems}
          mediaError={mediaError}
          currentUserRole={currentUserRole}
        />
      </TabsContent>

      <TabsContent value="members">
        <MembersTab
          planId={plan.id}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          members={members}
          pendingRequests={pendingRequests}
          membersError={membersError}
          requestsError={requestsError}
        />
      </TabsContent>

      <TabsContent value="expenses">
        <ExpensesTab
          plan={plan}
          expenses={expenses}
          members={members}
          expensesError={expensesError}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
        />
      </TabsContent>

      <TabsContent value="meetups">
        <PlanMeetupsTab
          plan={plan}
          meetups={meetups}
          members={members}
          meetupsError={meetupsError}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
        />
      </TabsContent>
    </Tabs>
  );
}
