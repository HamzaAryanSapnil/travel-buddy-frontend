import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatBudgetRange, formatDateRange } from "@/lib/formatters";
import { TravelPlan } from "@/types/travelPlan.interface";
import {
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import PlanDetailsDialog from "./PlanDetailsDialog";
import TravelPlanActions from "@/components/modules/Admin/TravelPlanActions";

interface PlanListItemProps {
  plan: TravelPlan;
  isAdminView?: boolean; // If true, show admin actions
}

const PlanListItem = ({ plan, isAdminView = false }: PlanListItemProps) => {
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
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          {/* Image */}
          <div className="relative w-full md:w-48 h-48 md:h-auto md:aspect-square overflow-hidden bg-muted rounded-lg flex-shrink-0">
            {plan.coverPhoto ? (
              <Image
                src={plan.coverPhoto}
                alt={plan.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 192px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <MapPin className="h-12 w-12 text-primary/30" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 min-w-0">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="hover:underline cursor-pointer">
                    <PlanDetailsDialog
                      plan={plan}
                      triggerLabel={plan.title}
                      triggerClassName="text-xl font-bold line-clamp-2 mb-1 h-auto p-0 hover:no-underline text-left justify-start"
                    />
                  </div>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {plan.description}
                    </p>
                  )}
                </div>
                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {isAdminView && <TravelPlanActions plan={plan} />}
                  <PlanDetailsDialog
                    plan={plan}
                    triggerLabel="View Details"
                    triggerClassName="w-full sm:w-auto"
                  />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {/* Destination */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-1">{plan.destination}</span>
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>{formatDateRange(plan.startDate, plan.endDate)}</span>
                </div>

                {/* Budget Range */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 flex-shrink-0" />
                  <span>{formatBudgetRange(plan.budgetMin, plan.budgetMax)}</span>
                </div>

                {/* Member Count */}
                {plan._count?.tripMembers !== undefined && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span>{plan._count.tripMembers} members</span>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {travelTypeLabels[plan.travelType] || plan.travelType}
                </Badge>
                <Badge
                  variant={
                    plan.visibility === "PUBLIC"
                      ? "default"
                      : plan.visibility === "PRIVATE"
                        ? "destructive"
                        : "outline"
                  }
                  className="flex items-center gap-1"
                >
                  {plan.visibility === "PRIVATE" && (
                    <EyeOff className="h-3 w-3" />
                  )}
                  {plan.visibility === "PUBLIC" && <Eye className="h-3 w-3" />}
                  {visibilityLabels[plan.visibility] || plan.visibility}
                </Badge>
                <Badge className={statusColors[status]}>
                  {statusLabels[status]}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanListItem;

