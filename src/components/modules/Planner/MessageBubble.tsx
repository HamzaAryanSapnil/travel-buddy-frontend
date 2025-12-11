import { ChatMessage } from "@/types/planner.interface";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import PlanSuggestionCard from "./PlanSuggestionCard";

interface MessageBubbleProps {
  message: ChatMessage;
  isUser: boolean;
}

export default function MessageBubble({ message, isUser }: MessageBubbleProps) {
  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} mb-4`}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%]`}>
        <Card className={isUser ? "bg-primary text-primary-foreground" : ""}>
          <CardContent className="p-3">
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
            {message.planData && (
              <div className="mt-3">
                <PlanSuggestionCard suggestion={message.planData} />
              </div>
            )}
          </CardContent>
        </Card>
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {format(new Date(message.timestamp), "HH:mm")}
        </span>
      </div>
    </div>
  );
}

