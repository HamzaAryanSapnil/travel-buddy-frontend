import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { notFound } from "next/navigation";
import AppImage from "@/components/shared/AppImage";
import { ASSETS } from "@/constants/assets";
import Link from "next/link";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import { getCookie } from "@/lib/actions/auth.action";
import { getTravelPlan } from "@/lib/actions/travelPlan.action";
import { getItinerary } from "@/lib/actions/itinerary.action";
import { getPublicTravelPlans } from "@/lib/actions/travelPlan.action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ItineraryDisplay from "@/components/modules/TravelPlans/ItineraryDisplay";
import { formatBudgetRange, formatDateRange } from "@/lib/formatters";
import MediaGalleryPreview from "@/components/modules/TravelPlans/MediaGalleryPreview";
import ReviewsPreview from "@/components/modules/TravelPlans/ReviewsPreview";
import JoinRequestButton from "@/components/modules/TravelPlans/JoinRequestButton";

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

export async function generateMetadata({
  params,
}: PlanDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getTravelPlan(id);
  const plan = result.data;
  if (!plan) {
    return { title: "Travel Plan" };
  }
  return {
    title: plan.title,
    description: plan.description || plan.destination,
  };
}

export default async function PlanDetailsPage({ params }: PlanDetailsPageProps) {
  const { id } = await params;
  const accessToken = await getCookie("accessToken");

  // Fetch plan details
  const { data: plan, statusCode } = await getTravelPlan(id);

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
              <Link href={ROUTES.LOGIN_REDIRECT_TRAVEL_PLAN(id)}>
                <Button>Login</Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button variant="outline">Register</Button>
              </Link>
              <Link href={ROUTES.TRAVEL_PLANS}>
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
              You don&apos;t have permission to view this travel plan
            </p>
            <Link href={ROUTES.TRAVEL_PLANS}>
              <Button>Back to All Plans</Button>
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  // Fetch itinerary
  const { data: itineraryDays } = await getItinerary(id);

  const jsonLd: Record<string, string> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: plan.title,
  };
  if (plan.description) jsonLd.description = plan.description;
  if (plan.destination) jsonLd.touristType = plan.destination;

  return (
    <main className="min-h-screen py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover Image */}
        {plan?.coverPhoto && (
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
            <AppImage
              src={plan?.coverPhoto}
              alt={plan?.title || "Travel Plan"}
              fill
              className="object-cover"
              priority
              sizes={ASSETS.cover.sizes}
            />
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
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
                {plan._count?.tripMembers !== undefined && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{plan._count.tripMembers} members</span>
                  </div>
                )}
              </div>
            </div>

            {/* Join Request Button - Only if authenticated and not owner */}
            {/* Note: We need to determine if current user is member or owner. 
                For now we assume basic authenticated state. Real implementation 
                would require checking against member list or user ID if available in plan data.
            */}
            <div className="flex flex-col gap-2 min-w-[200px]">
               <JoinRequestButton
                  planId={plan.id}
                  planTitle={plan.title}
                  plan={plan}
                  isAuthenticated={!!accessToken}
                  // These props would come from API in a real scenario
                  // isMember={false} 
                  // requestStatus={null} 
               />
               
               {accessToken && (
                 <Link href={ROUTES.DASHBOARD_TRAVEL_PLAN(id)} className="w-full">
                    <Button variant="outline" className="w-full">
                      View in Dashboard
                    </Button>
                 </Link>
               )}
            </div>
          </div>

          {/* Description */}
          {plan.description && (
            <Card className="mb-8 mt-6">
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

        {/* Action Buttons - Moved logic up to header, kept consistent bottom nav */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-8">
            <Link href={ROUTES.TRAVEL_PLANS}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse All Plans
                </Button>
            </Link>
            {!accessToken && (
              <Link href={ROUTES.LOGIN_CREATE_PLAN}>
                <Button size="lg" className="gap-2">
                  <Users className="h-5 w-5" />
                  Create Your Plan
                </Button>
              </Link>
            )}
        </div>
      </div>
    </main>
  );
}

