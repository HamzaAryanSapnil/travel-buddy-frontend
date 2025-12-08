export interface Reviewer {
  id: string;
  fullName: string;
  avatar?: string | null;
}

export interface Review {
  id: string;
  rating: number; // 1-5
  comment?: string | null;
  reviewer: Reviewer;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Review[];
}

export interface ReviewStatistics {
  averageRating: number; // 0-5, can be decimal
  totalReviews: number;
  ratingDistribution?: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

export interface ReviewStatisticsResponse {
  success: boolean;
  message: string;
  data: ReviewStatistics | null;
}

