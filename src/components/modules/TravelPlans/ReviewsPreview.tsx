import { getReviews } from "@/services/reviews/getReviews";
import { getReviewStatistics } from "@/services/reviews/getReviewStatistics";
import ReviewCard from "./ReviewCard";
import StarRating from "@/components/shared/StarRating";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface ReviewsPreviewProps {
  planId: string;
  isAuthenticated: boolean;
}

export default async function ReviewsPreview({
  planId,
  isAuthenticated,
}: ReviewsPreviewProps) {
  // Fetch reviews and statistics in parallel
  const [reviewsResult, statisticsResult] = await Promise.all([
    getReviews({
      planId,
      limit: 3,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    getReviewStatistics(planId),
  ]);

  const reviews = reviewsResult.data || [];
  const statistics = statisticsResult.data;
  const hasReviews = reviews.length > 0;
  const hasStatistics = statistics && statistics.totalReviews > 0;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {isAuthenticated && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/reviews?planId=${planId}`}>
              View All Reviews
            </Link>
          </Button>
        )}
      </div>

      {/* Average Rating Section */}
      {hasStatistics && (
        <div className="mb-6 p-6 bg-muted/50 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <StarRating
                rating={statistics.averageRating}
                size="lg"
                showValue={true}
              />
            </div>
            <div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Based on {statistics.totalReviews}{" "}
                {statistics.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Reviews List */}
      {hasReviews ? (
        <div className="space-y-4 mb-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No reviews yet for this plan</p>
        </Card>
      )}

      {/* View All Reviews Button (for unauthenticated users) */}
      {!isAuthenticated && hasReviews && (
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href={`/login?redirect=/dashboard/reviews?planId=${planId}`}>
              View All Reviews
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

