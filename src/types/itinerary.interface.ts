export interface ItineraryItem {
  id: string;
  planId: string;
  dayIndex: number;
  title: string;
  description?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  locationId?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}


export interface ItineraryDay {
  day: number;
  items: ItineraryItem[];
}

export interface ItineraryDaysResponse {
  success: boolean;
  message: string;
  data: {
    days: ItineraryDay[];
    totalDays: number;
  };
}

export interface ItineraryItemResponse {
  success: boolean;
  message: string;
  data?: ItineraryItem[];
}

