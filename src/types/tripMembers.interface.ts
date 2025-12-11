import { UserInfo } from "./user.interface";

export type TripRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: TripRole;
  createdAt: string;
  updatedAt: string;
  user: UserInfo;
}

export interface TripMembersResponse {
  success: boolean;
  message: string;
  data: TripMember[];
}

