import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import { getCookie } from "@/services/auth/tokenHandlers";
import { getTravelPlan } from "@/services/travelPlans/getTravelPlan";
import { getItinerary } from "@/services/itinerary/getItinerary";
import { getPublicTravelPlans } from "@/services/travelPlans/getPublicTravelPlans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ItineraryDisplay from "@/components/modules/TravelPlans/ItineraryDisplay";
import { formatBudgetRange, formatDateRange } from "@/lib/formatters";
import MediaGalleryPreview from "@/components/modules/TravelPlans/MediaGalleryPreview";
import ReviewsPreview from "@/components/modules/TravelPlans/ReviewsPreview";

interface PlanDetailsPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate static params for top 20 travel plans at build time
 * This pre-renders the most popular plans for instant loading
 */
export async function generateStaticParams() {
  try {
    // Fetch top 20 public plans at build time
    const plans = await getPublicTravelPlans({
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    // Return array of params for static generation
    return plans.data.map((plan) => ({
      id: plan.id,
    }));
  } catch (error) {
    console.error("Error generating static params for travel plans:", error);
    // Return empty array on error (graceful degradation)
    // Pages will still be generated on-demand via ISR
    return [];
  }
}

// ISR: Revalidate every 72 hours (259200 seconds) - tags are primary mechanism
export const revalidate = 259200;

export default async function PlanDetailsPage({ params }: PlanDetailsPageProps) {
  const { id } = await params;
  const accessToken = await getCookie("accessToken");

  // Fetch plan details
  const { data: plan, error: planError, statusCode } = await getTravelPlan(id);

  // Handle 404
  if (statusCode === 404 || !plan) {
    notFound();
  }

  // Handle 401 - auth required
  if (statusCode === 401) {
    return (
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="container mx-auto text-center p-12">
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-6">
              Please log in to view this travel plan
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={`/login?redirect=/travel-plans/${id}`}>
                <Button>Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link>
              <Link href="/travel-plans">
                <Button variant="ghost">Browse Public Plans</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  // Handle 403 - no access
  if (statusCode === 403) {
    return (
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="container mx-auto text-center p-12">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to view this travel plan
            </p>
            <Link href="/travel-plans">
              <Button>Back to All Plans</Button>
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  // Fetch itinerary
  const { data: itineraryDays } = await getItinerary(id);

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover Image */}
        {plan.coverPhoto && (
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
            <Image
              src={plan.coverPhoto}
              alt={plan.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="secondary" className="text-sm">
              {plan.travelType}
            </Badge>
            <Badge
              variant={
                plan.visibility === "PUBLIC"
                  ? "default"
                  : plan.visibility === "PRIVATE"
                  ? "destructive"
                  : "outline"
              }
              className="text-sm"
            >
              {plan.visibility}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {plan.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{plan.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formatDateRange(plan.startDate, plan.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span>{formatBudgetRange(plan.budgetMin, plan.budgetMax)}</span>
            </div>
            {plan._count?.tripMembers && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{plan._count.tripMembers} members</span>
              </div>
            )}
          </div>

          {/* Description */}
          {plan.description && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-3">About This Trip</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {plan.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-8" />

        {/* Itinerary Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Full Itinerary</h2>
          {itineraryDays ? (
            <ItineraryDisplay days={itineraryDays} planStartDate={plan.startDate} />
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No itinerary available for this plan</p>
            </Card>
          )}
        </div>

        <Separator className="my-8" />

        {/* Media Gallery Preview */}
        <MediaGalleryPreview planId={id} isAuthenticated={!!accessToken} />

        <Separator className="my-8" />

        {/* Reviews Section */}
        <ReviewsPreview planId={id} isAuthenticated={!!accessToken} />

        <Separator className="my-8" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-8">
          {accessToken ? (
            <>
              <Link href={`/dashboard/travel-plans/${id}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  Open in Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/travel-plans/create">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Create New Plan
                </Button>
              </Link>
            </>
          ) : (
            <div className="text-center">
              <p className="text-lg mb-4 text-muted-foreground">
                Start planning your own adventure!
              </p>
              <Link href="/login?redirect=/dashboard/travel-plans/create">
                <Button size="lg" className="gap-2">
                  <Users className="h-5 w-5" />
                  Create Your Plan
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

