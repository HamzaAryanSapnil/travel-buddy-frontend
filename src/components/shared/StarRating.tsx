"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 0-5, can be decimal
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export default function StarRating({
  rating,
  size = "md",
  showValue = false,
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSize = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={`full-${index}`}
          className={cn(starSize, "fill-yellow-500 text-yellow-500")}
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative inline-block">
          <Star
            className={cn(starSize, "text-gray-300")}
          />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: "50%" }}>
            <Star
              className={cn(starSize, "text-yellow-500 fill-yellow-500")}
            />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={`empty-${index}`}
          className={cn(starSize, "text-gray-300")}
        />
      ))}

      {/* Optional numeric value */}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}/5
        </span>
      )}
    </div>
  );
}

