import { UserRole } from "@/lib/auth-utils";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  fullName?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  visitedCountries?: string[];
  isVerified?: boolean;
  status?: "ACTIVE" | "SUSPENDED" | "DELETED";
  needPasswordChange?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

