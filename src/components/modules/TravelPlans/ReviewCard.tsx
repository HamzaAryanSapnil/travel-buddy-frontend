import { Review } from "@/types/review.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/shared/StarRating";
import { format } from "date-fns";
import Image from "next/image";
import { User } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = format(new Date(review.createdAt), "MMM d, yyyy");

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Header: Reviewer info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
            {review.reviewer.avatar ? (
              <Image
                src={review.reviewer.avatar}
                alt={review.reviewer.fullName}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <User className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm sm:text-base">
                {review.reviewer.fullName}
              </p>
              {review.isEdited && (
                <Badge variant="secondary" className="text-xs">
                  Edited
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={review.rating} size="sm" />
        </div>

        {/* Comment */}
        {review.comment && (
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            {review.comment}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

