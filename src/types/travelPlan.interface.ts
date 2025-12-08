export interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  travelType: "SOLO" | "COUPLE" | "FAMILY" | "FRIENDS" | "GROUP";
  budgetMin: number;
  budgetMax?: number;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  coverPhoto?: string | null;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  // Optional fields from API
  totalDays?: number;
  _count?: {
    itineraryItems: number;
    tripMembers: number;
  };
  status?: "UPCOMING" | "ONGOING" | "PAST";
}

export interface TravelPlansResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: TravelPlan[];
}

export interface TravelPlansFilters {
  searchTerm?: string;
  travelType?: "SOLO" | "COUPLE" | "FAMILY" | "FRIENDS" | "GROUP";
  visibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
  isFeatured?: boolean;
  type?: "future" | "past"; // Filter by date: future (startDate >= today) or past (endDate < today)
  sortBy?: "createdAt" | "startDate" | "budgetMin";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

