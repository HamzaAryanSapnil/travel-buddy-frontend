import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="flex gap-1">
        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
      </div>
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

