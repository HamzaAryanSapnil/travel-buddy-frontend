/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PlanSuggestion } from "@/types/planner.interface";
import { saveGeneratedPlan } from "@/services/planner/saveGeneratedPlan";
import ChatInterface from "./ChatInterface";
import PlanPreview from "./PlanPreview";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PlannerContainerProps {
  currentUserId: string;
}

export default function PlannerContainer({ currentUserId }: PlannerContainerProps) {
  const [currentSuggestion, setCurrentSuggestion] = useState<PlanSuggestion | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();

  const handleSuggestionReceived = (suggestion: PlanSuggestion, receivedSessionId?: string) => {
    setCurrentSuggestion(suggestion);
    if (receivedSessionId) {
      setSessionId(receivedSessionId);
    }
  };

  const handleSave = async () => {
    if (!currentSuggestion) return;

    try {
      await saveGeneratedPlan(currentSuggestion, sessionId || undefined);
      // saveGeneratedPlan handles redirect internally
    } catch (error: any) {
      console.error("Save plan error:", error);
      toast.error("Failed to save plan. Please try again.");
    }
  };

  const handleEdit = () => {
    // For now, redirect to create plan page with pre-filled data
    // In the future, we can open an edit dialog
    if (!currentSuggestion) return;
    
    // Store suggestion in sessionStorage for pre-filling
    sessionStorage.setItem("aiPlanSuggestion", JSON.stringify(currentSuggestion));
    router.push("/dashboard/travel-plans/create?fromAI=true");
  };

  const handleDiscard = () => {
    setCurrentSuggestion(null);
    toast.info("Plan suggestion discarded. You can continue chatting.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Travel Planner</h1>
        <p className="text-muted-foreground">
          Let our AI help you create the perfect travel plan. Just answer a few questions!
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chat Interface */}
        <div className="lg:col-span-1">
          <div className="h-[600px]">
            <ChatInterface onSuggestionReceived={handleSuggestionReceived} />
          </div>
        </div>

        {/* Plan Preview */}
        <div className="lg:col-span-1">
          {currentSuggestion ? (
            <div className="sticky top-6">
              <PlanPreview
                suggestion={currentSuggestion}
                onSave={handleSave}
                onEdit={handleEdit}
                onDiscard={handleDiscard}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[600px] border rounded-lg bg-muted/30">
              <div className="text-center text-muted-foreground space-y-2">
                <p className="text-lg font-semibold">No Plan Generated Yet</p>
                <p className="text-sm">
                  Start chatting with the AI to generate your travel plan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

