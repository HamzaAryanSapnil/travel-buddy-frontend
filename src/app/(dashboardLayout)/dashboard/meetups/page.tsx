import { Suspense } from "react";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getMeetups } from "@/services/meetups/getMeetups";
import MeetupsList from "@/components/modules/Meetups/MeetupsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default async function MeetupsPage() {
  const userInfo = await getUserInfo();

  // Fetch all meetups for the current user
  const { data: meetups, error } = await getMeetups();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meetups</h1>
        <p className="text-muted-foreground">
          View and manage all your scheduled meetups
        </p>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-6 text-center text-destructive">
          <p>Error: {error}</p>
        </Card>
      )}

      {/* Meetups List */}
      <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
        <MeetupsList
          meetups={meetups}
          currentUserId={userInfo?.id}
          currentUserRole={userInfo?.role}
        />
      </Suspense>
    </div>
  );
}

