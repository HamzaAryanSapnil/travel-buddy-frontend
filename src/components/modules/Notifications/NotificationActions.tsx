"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { markAllAsRead } from "@/lib/actions/notification.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function NotificationActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      const result = await markAllAsRead();
      if (result.success) {
        toast.success(result.message || "All notifications marked as read");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to mark all as read");
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleMarkAllAsRead}
      disabled={isPending}
    >
      <Check className="mr-2 h-4 w-4" />
      {isPending ? "Marking..." : "Mark All as Read"}
    </Button>
  );
}

