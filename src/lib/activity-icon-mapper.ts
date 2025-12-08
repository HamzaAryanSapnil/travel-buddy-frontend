import type { LucideIcon } from "lucide-react";
import {
  Map,
  Users,
  DollarSign,
  Calendar,
  FileText,
  UserPlus,
  UserMinus,
  CreditCard,
  CheckCircle,
  Activity,
} from "lucide-react";
import { ActivityType } from "@/types/dashboard.interface";

/**
 * Map activity types to Lucide icons
 */
export function getActivityIcon(type: ActivityType): LucideIcon {
  switch (type) {
    case "PLAN_CREATED":
    case "PLAN_UPDATED":
      return Map;
    case "MEMBER_JOINED":
      return UserPlus;
    case "MEMBER_LEFT":
      return UserMinus;
    case "EXPENSE_ADDED":
    case "EXPENSE_UPDATED":
    case "EXPENSE_DELETED":
      return DollarSign;
    case "MEETUP_CREATED":
    case "MEETUP_UPDATED":
      return Calendar;
    case "ITINERARY_ADDED":
    case "ITINERARY_UPDATED":
      return FileText;
    case "USER_REGISTERED":
      return Users;
    case "SUBSCRIPTION_CREATED":
      return CreditCard;
    case "PAYMENT_SUCCEEDED":
      return CheckCircle;
    default:
      return Activity;
  }
}

