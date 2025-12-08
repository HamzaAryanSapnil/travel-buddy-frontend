import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import CreateTravelPlanForm from "@/components/modules/TravelPlans/CreateTravelPlanForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const revalidate = 0;

const FormSkeleton = () => (
  <Card className="p-6 space-y-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-10 w-full" />
  </Card>
);

export default function CreateTravelPlanPage() {
  return (
    <div className=" mt-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 w-full ">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/travel-plans">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Travel Plan</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details below to create your travel plan
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<FormSkeleton />}>
          <Card className="p-6">
            <CreateTravelPlanForm />
          </Card>
        </Suspense>
      </div>
    </div>
  );
}

