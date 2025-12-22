import { TravelPlan } from "@/types/travelPlan.interface";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import TravelPlanTableActions from "./TravelPlanTableActions";

interface TravelPlansTableProps {
  plans: TravelPlan[];
  error?: string | null;
}

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

export default function TravelPlansTable({
  plans,
  error,
}: TravelPlansTableProps) {
  if (error) {
    return (
      <Card className="p-6 text-center text-destructive">
        Error loading travel plans: {error}
      </Card>
    );
  }

  if (!plans.length) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No travel plans found.
      </Card>
    );
  }

  return (
    <Card className="p-2 sm:p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-2">Title</th>
              <th className="text-left py-2">Destination</th>
              <th className="text-left py-2">Owner ID</th>
              <th className="text-left py-2">Travel Type</th>
              <th className="text-left py-2">Visibility</th>
              <th className="text-left py-2">Featured</th>
              <th className="text-left py-2">Created</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b last:border-0">
                <td className="py-3">
                  <div className="font-medium">{plan.title}</div>
                </td>
                <td className="py-3 text-muted-foreground">
                  {plan.destination}
                </td>
                <td className="py-3 text-muted-foreground">
                  <span className="font-mono text-xs">
                    {plan.ownerId.slice(0, 8)}...
                  </span>
                </td>
                <td className="py-3">
                  <Badge variant="secondary">
                    {travelTypeLabels[plan.travelType] || plan.travelType}
                  </Badge>
                </td>
                <td className="py-3">
                  <Badge
                    variant={
                      plan.visibility === "PUBLIC"
                        ? "default"
                        : plan.visibility === "PRIVATE"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {visibilityLabels[plan.visibility] || plan.visibility}
                  </Badge>
                </td>
                <td className="py-3">
                  {plan.isFeatured ? (
                    <Badge className="bg-amber-500 text-white">Featured</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="py-3 text-muted-foreground">
                  {plan.createdAt
                    ? format(new Date(plan.createdAt), "MMM d, yyyy")
                    : "N/A"}
                </td>
                <td className="py-3">
                  <div className="flex justify-end">
                    <TravelPlanTableActions plan={plan} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

