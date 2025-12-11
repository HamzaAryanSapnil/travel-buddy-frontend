import { PlanSuggestion } from "@/types/planner.interface";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/expense-utils";
import PlanSuggestionCard from "./PlanSuggestionCard";

interface PlanPreviewProps {
  suggestion: PlanSuggestion;
  onSave: () => void;
  onEdit: () => void;
  onDiscard: () => void;
}

const travelTypeLabels: Record<PlanSuggestion["travelType"], string> = {
  SOLO: "Solo",
  COUPLE: "Couple",
  FAMILY: "Family",
  FRIENDS: "Friends",
  GROUP: "Group",
};

export default function PlanPreview({
  suggestion,
  onSave,
  onEdit,
  onDiscard,
}: PlanPreviewProps) {
  return (
    <Card className="border-primary/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Your Travel Plan is Ready!</CardTitle>
        <CardDescription>
          Review the details below and choose an action
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PlanSuggestionCard suggestion={suggestion} />
        
        {suggestion.itinerary && suggestion.itinerary.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Itinerary Preview</h4>
            <div className="space-y-2">
              {suggestion.itinerary.slice(0, 3).map((day, idx) => (
                <div key={idx} className="text-sm text-muted-foreground">
                  <span className="font-medium">Day {day.day}:</span>{" "}
                  {day.items.length} activities
                </div>
              ))}
              {suggestion.itinerary.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  +{suggestion.itinerary.length - 3} more days
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">
        <Button onClick={onSave} className="flex-1 min-w-[120px]">
          Save Plan
        </Button>
        <Button onClick={onEdit} variant="outline" className="flex-1 min-w-[120px]">
          Edit & Save
        </Button>
        <Button onClick={onDiscard} variant="ghost" className="flex-1 min-w-[120px]">
          Discard
        </Button>
      </CardFooter>
    </Card>
  );
}

