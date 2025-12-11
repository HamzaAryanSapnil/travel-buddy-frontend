import { PlanSuggestion } from "@/types/planner.interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/expense-utils";

interface PlanSuggestionCardProps {
  suggestion: PlanSuggestion;
}

const travelTypeLabels: Record<PlanSuggestion["travelType"], string> = {
  SOLO: "Solo",
  COUPLE: "Couple",
  FAMILY: "Family",
  FRIENDS: "Friends",
  GROUP: "Group",
};

export default function PlanSuggestionCard({ suggestion }: PlanSuggestionCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg">{suggestion.title}</CardTitle>
        <CardDescription>
          {suggestion.origin && `${suggestion.origin} → `}
          {suggestion.destination}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {format(new Date(suggestion.startDate), "MMM d")} -{" "}
            {format(new Date(suggestion.endDate), "MMM d, yyyy")}
          </Badge>
          <Badge variant="outline">{travelTypeLabels[suggestion.travelType]}</Badge>
          <Badge variant="outline">
            {formatCurrency(suggestion.budgetMin)}
            {suggestion.budgetMax && ` - ${formatCurrency(suggestion.budgetMax)}`}
          </Badge>
        </div>
        {suggestion.description && (
          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
        )}
        {suggestion.estimatedCost && (
          <p className="text-sm font-medium">
            Estimated Cost: {formatCurrency(suggestion.estimatedCost)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

