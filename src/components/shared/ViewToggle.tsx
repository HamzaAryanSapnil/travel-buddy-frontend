"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const ViewToggle = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentView = searchParams.get("view") || "grid";

  const handleViewChange = (view: "grid" | "list") => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (view === "grid") {
      params.delete("view"); // Remove param for default grid view
    } else {
      params.set("view", view);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-1 border rounded-md p-1">
      <Button
        variant={currentView === "grid" ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => handleViewChange("grid")}
        disabled={isPending}
        title="Grid View"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === "list" ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => handleViewChange("list")}
        disabled={isPending}
        title="List View"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;

