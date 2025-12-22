"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatBudgetRange, formatDateRange } from "@/lib/formatters";
import { TravelPlan } from "@/types/travelPlan.interface";
import {
  Calendar,
  DollarSign,
  ExternalLink,
  MapPin,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PlanDetailsDialog from "./PlanDetailsDialog";
import TravelPlanActions from "@/components/modules/Admin/TravelPlanActions";

interface PlanCardProps {
  plan: TravelPlan;
  isMember?: boolean;
  isDashboard?: boolean; // If true, use dashboard routes and show actions
  isAdminView?: boolean; // If true, show admin actions
}

const PlanCard = ({
  plan,
  isMember = false,
  isDashboard = false,
  isAdminView = false,
}: PlanCardProps) => {
  const visibilityLabels: Record<string, string> = {
    PUBLIC: "Public",
    PRIVATE: "Private",
    UNLISTED: "Unlisted",
  };

  const travelTypeLabels: Record<string, string> = {
    SOLO: "Solo",
    COUPLE: "Couple",
    FAMILY: "Family",
    FRIENDS: "Friends",
    GROUP: "Group",
  };

  // Calculate status based on dates
  const getStatus = (): "UPCOMING" | "ONGOING" | "PAST" => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(plan.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(plan.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (startDate > today) {
      return "UPCOMING";
    } else if (endDate < today) {
      return "PAST";
    } else {
      return "ONGOING";
    }
  };

  const status = getStatus();
  const statusLabels: Record<string, string> = {
    UPCOMING: "Upcoming",
    ONGOING: "Ongoing",
    PAST: "Past",
  };

  const statusColors: Record<string, string> = {
    UPCOMING: "bg-blue-500 hover:bg-blue-600",
    ONGOING: "bg-green-500 hover:bg-green-600",
    PAST: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col h-full">
      {/* Cover Image with Badges */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        {plan.coverPhoto ? (
          <Image
            src={plan?.coverPhoto}
            alt={plan?.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={plan?.coverPhoto?.includes("i.ibb.co")}
            onError={(e) => {
              console.error("Image load error:", plan?.coverPhoto);
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <MapPin className="h-16 w-16 text-primary/30" />
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
          {isAdminView && (
            <div className="flex items-center gap-2">
              <TravelPlanActions plan={plan} />
            </div>
          )}
          {isDashboard && (
            <div className="flex items-center gap-2">
              {/* Actions moved to Details Dialog */}
            </div>
          )}
          {plan?.isFeatured && (
            <Badge
              className="bg-amber-500 text-white shadow-sm backdrop-blur-sm"
              variant="default"
            >
              Featured
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="bg-background/90 backdrop-blur-sm"
          >
            {travelTypeLabels[plan?.travelType] || plan?.travelType}
          </Badge>
          <Badge
            variant={
              plan?.visibility === "PUBLIC"
                ? "default"
                : plan?.visibility === "PRIVATE"
                ? "destructive"
                : "outline"
            }
            className="bg-background/90 backdrop-blur-sm flex items-center gap-1 text-background-foreground dark:text-foreground"
          >
            {plan?.visibility === "PRIVATE" && <EyeOff className="h-3 w-3" />}
            {plan?.visibility === "PUBLIC" && <Eye className="h-3 w-3" />}
            {visibilityLabels[plan?.visibility] || plan?.visibility}
          </Badge>
          {isDashboard && (
            <Badge
              className={`${statusColors[status]} bg-background/90 backdrop-blur-sm text-background-foreground dark:text-foreground`}
            >
              {statusLabels[status]}
            </Badge>
          )}
        </div>
      </div>

      {/* Card Content */}
      <CardHeader className="flex-1">
        <h3 className="text-xl font-bold line-clamp-2 mb-2">{plan?.title}</h3>
        {plan.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {plan?.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        {/* Destination */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{plan?.destination}</span>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{formatDateRange(plan?.startDate, plan?.endDate)}</span>
        </div>

        {/* Budget Range */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4 shrink-0" />
          <span>{formatBudgetRange(plan?.budgetMin, plan?.budgetMax)}</span>
        </div>

        {/* Member Count (if available and in dashboard) */}
        {isDashboard && plan?._count?.tripMembers !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>{plan?._count?.tripMembers} members</span>
          </div>
        )}
      </CardContent>

      {/* Card Footer with Actions */}
      <CardFooter className="flex flex-col gap-2 pt-4">
        {isDashboard ? (
          <PlanDetailsDialog
            plan={plan}
            triggerLabel="View Details"
            triggerClassName="w-full"
          />
        ) : (
          <>
            <Button asChild className="w-full" size="default">
              <Link href={`/travel-plans/${plan?.id}`}>View Details</Link>
            </Button>
            {isMember && (
              <Button
                asChild
                variant="outline"
                className="w-full"
                size="default"
              >
                <Link href={`/dashboard/travel-plans/${plan?.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Dashboard
                </Link>
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
