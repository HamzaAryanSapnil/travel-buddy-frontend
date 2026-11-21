"use client";

import {
  useActionState,
  useState,
  useTransition,
  useEffect,
  useRef,
} from "react";
import { sendMessage } from "@/lib/actions/planner.action";
import { toast } from "sonner";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import LoadingIndicator from "./LoadingIndicator";
import { Card, CardContent } from "@/components/ui/card";

const STEP_ORDER: UIStep[] = [
  "destination",
  "groupSize",
  "budget",
  "tripDuration",
  "interests",
  "specialRequirements",
  "Final",
];

const STEP_PROMPTS: Record<UIStep, string> = {
  destination: "What is your travel destination?",
  groupSize: "How many people are traveling?",
  budget: "What is your budget range?",
  tripDuration: "How many days will you travel?",
  interests: "What are your interests or preferred activities?",
  specialRequirements: "Any special requirements or constraints?",
  Final: "Ready to generate your itinerary?",
};

const getNextStep = (current?: UIStep | null) => {
  if (!current) return "destination";
  const idx = STEP_ORDER.indexOf(current);
  if (idx === -1) return "destination";
  return STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
};

function readPlannerSessionId(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as {
    session?: { id?: string };
    sessionId?: string;
    id?: string;
  };
  const candidates = [d.session?.id, d.sessionId, d.id];
  for (const value of candidates) {
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return null;
}

function isUIStep(value: unknown): value is UIStep {
  return (
    typeof value === "string" &&
    (STEP_ORDER as readonly string[]).includes(value)
  );
}

function readPlannerResponseData(data: unknown): {
  id?: string;
  uiStep?: UIStep;
  question?: string;
  response?: string;
  suggestion?: PlanSuggestion;
} | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const result: {
    id?: string;
    uiStep?: UIStep;
    question?: string;
    response?: string;
    suggestion?: PlanSuggestion;
  } = {};
  if (typeof d.id === "string") result.id = d.id;
  if (isUIStep(d.uiStep)) result.uiStep = d.uiStep;
  if (typeof d.question === "string") result.question = d.question;
  if (typeof d.response === "string") result.response = d.response;
  if (d.suggestion && typeof d.suggestion === "object") {
    result.suggestion = d.suggestion as PlanSuggestion;
  }
  return result;
}

interface ChatInterfaceProps {
  onSuggestionReceived?: (
    suggestion: PlanSuggestion,
    sessionId?: string
  ) => void;
}

export default function ChatInterface({
  onSuggestionReceived,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<UIStep | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [state, formAction] = useActionState(sendMessage, null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  // Handle form action response
  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        const responseData = readPlannerResponseData(state.data);
        const resolvedSessionId = readPlannerSessionId(state.data);
        if (resolvedSessionId && !sessionId) {
          setSessionId(resolvedSessionId);
        }

        const serverStep = responseData?.uiStep;
        const nextStep = serverStep
          ? serverStep
          : getNextStep(currentStep || "destination");
        setCurrentStep(nextStep);

        // Update current question (next prompt from server or fallback)
        const nextQuestion =
          responseData?.question ||
          STEP_PROMPTS[nextStep] ||
          STEP_PROMPTS.destination;
        setCurrentQuestion(nextQuestion);

        // If we have a response, add AI message
        if (responseData?.response) {
          const aiMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: responseData.response,
            timestamp: new Date().toISOString(),
            uiStep: responseData.uiStep,
          };

          // If we have a suggestion, add it to the message
          if (responseData.suggestion) {
            aiMessage.planData = responseData.suggestion;
            onSuggestionReceived?.(
              responseData.suggestion,
              sessionId || readPlannerSessionId(state.data) || undefined
            );
          }

          setMessages((prev) => [...prev, aiMessage]);
        }

        // Clear input after a successful send
        setInput("");
      });
    } else if (state && state.success === false && state.message) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : "Failed to send message";

      toast.error(message);
    }
  }, [state, sessionId, currentStep, onSuggestionReceived]);

  const handleSubmit = () => {
    if (!input.trim() || isPending) return;

    // Use latest session id from state to avoid recreating session
    const effectiveSessionId =
      sessionId || readPlannerSessionId(state?.data) || null;
    const stepToSend = currentStep || "destination";

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
      uiStep: currentStep || undefined,
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);

    // Prepare form data
    const formData = new FormData();

    if (!effectiveSessionId) {
      // Creating new session - just send the message
      formData.append("message", input.trim());
    } else {
      // Adding a step - need answer and uiStep
      formData.append("sessionId", effectiveSessionId);
      formData.append("message", currentQuestion || input.trim());
      formData.append("answer", input.trim());
      formData.append("uiStep", stepToSend);
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">Welcome to AI Planner!</p>
                <p className="text-sm">
                  Start by telling me about your travel plans. I&apos;ll ask you
                  a few questions to create the perfect itinerary.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isUser={message.role === "user"}
                />
              ))}
              {isPending && <LoadingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Input Area */}
      <div className="mt-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isPending}
          placeholder={
            currentQuestion
              ? currentQuestion
              : "Tell me about your travel plans..."
          }
        />
      </div>
    </div>
  );
}
