"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SubscriptionSuccessClientProps {
  sessionId: string;
}

export default function SubscriptionSuccessClient({
  sessionId,
}: SubscriptionSuccessClientProps) {
  const router = useRouter();

  useEffect(() => {
    // Show success toast
    toast.success("Subscription activated successfully!");

    // Refresh the page data after a short delay to ensure backend has processed the webhook
    const timer = setTimeout(() => {
      router.refresh();
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">
        Session ID: <code className="text-xs bg-muted px-2 py-1 rounded">
          {sessionId}
        </code>
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Your subscription details will be updated shortly.
      </p>
    </div>
  );
}

