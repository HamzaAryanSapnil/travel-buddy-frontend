import { UserInfo } from "./user.interface";
import { TravelPlan } from "./travelPlan.interface";

export type MeetupStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type RSVPStatus = "ACCEPTED" | "DECLINED" | "PENDING" | "MAYBE";

export interface RSVP {
  id: string;
  meetupId: string;
  userId: string;
  status: RSVPStatus;
  respondedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  user?: UserInfo;
}

export interface Meetup {
  id: string;
  planId: string;
  title: string;
  description?: string | null;
  location: string;
  scheduledAt: string;
  endAt?: string | null;
  videoRoomLink?: string | null; // Google Meet link (optional)
  status: MeetupStatus;
  createdBy: string; // userId
  createdAt: string;
  updatedAt: string;
  // Relations
  plan?: TravelPlan;
  createdByUser?: UserInfo;
  rsvps?: RSVP[];
}

export interface MeetupsResponse {
  success: boolean;
  message: string;
  data: Meetup[];
}

export interface MeetupResponse {
  success: boolean;
  message: string;
  data?: Meetup;
}

export interface RSVPResponse {
  success: boolean;
  message: string;
  data?: RSVP;
}

