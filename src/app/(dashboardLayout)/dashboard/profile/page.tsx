import { getUserInfo } from "@/services/auth/getUserInfo";
import ProfilePageClient from "@/components/modules/Profile/ProfilePageClient";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProfilePage() {
  const userInfo = await getUserInfo();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ProfilePageClient userInfo={userInfo} />
      </Suspense>
    </div>
  );
}

