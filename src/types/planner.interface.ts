import { ItineraryDay } from "./itinerary.interface";
import { TravelPlan } from "./travelPlan.interface";

export type UIStep =
  | "destination"
  | "groupSize"
  | "budget"
  | "tripDuration"
  | "interests"
  | "specialRequirements"
  | "Final";

export interface PromptFlowItem {
  q: string;
  a: string;
  uiStep: UIStep;
  ts: string;
}

export interface FinalOutput {
  title: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  travelType: TravelPlan["travelType"];
  budgetMin: number;
  budgetMax?: number;
  description?: string;
  itinerary?: ItineraryDay[];
  estimatedCost?: number;
}

export interface PlanningSession {
  id: string;
  userId: string;
  planId?: string | null;
  promptFlow: PromptFlowItem[];
  finalOutput?: FinalOutput | null;
  uiState: {
    currentStep: UIStep;
    remainingAIUses: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  planData?: PlanSuggestion;
  uiStep?: UIStep;
}

export interface PlanSuggestion {
  title: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  travelType: TravelPlan["travelType"];
  budgetMin: number;
  budgetMax?: number;
  description?: string;
  itinerary?: ItineraryDay[];
  estimatedCost?: number;
}

export interface PlannerState {
  messages: ChatMessage[];
  currentSuggestion?: PlanSuggestion;
  isLoading: boolean;
  sessionId?: string;
  currentStep?: UIStep;
  remainingAIUses?: number;
}

export interface PlannerResponse {
  success: boolean;
  message: string;
  data?: {
    id?: string; // sessionId
    question?: string;
    uiStep?: UIStep;
    remainingAIUses?: number;
    suggestion?: PlanSuggestion;
    response?: string;
    planId?: string;
  };
}

export interface PlanningSessionsResponse {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: PlanningSession[];
}

