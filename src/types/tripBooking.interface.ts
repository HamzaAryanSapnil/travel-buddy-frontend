import { TravelPlan } from "./travelPlan.interface";
import { UserInfo } from "./user.interface";

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface TripBooking {
  id: string;
  planId: string;
  userId: string;
  status: BookingStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  plan?: TravelPlan;
  user?: UserInfo;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: TripBooking;
}

export interface MyBookingsResponse {
  success: boolean;
  message: string;
  data: TripBooking[];
}

export interface PlanBookingsResponse {
  success: boolean;
  message: string;
  data: TripBooking[];
}

