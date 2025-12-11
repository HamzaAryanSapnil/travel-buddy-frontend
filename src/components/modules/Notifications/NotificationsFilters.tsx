"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filter = searchParams.get("filter") || "all";

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    params.set("page", "1"); // Reset to first page
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Tabs value={filter} onValueChange={handleFilterChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all" disabled={isPending}>
          All
        </TabsTrigger>
        <TabsTrigger value="unread" disabled={isPending}>
          Unread
        </TabsTrigger>
        <TabsTrigger value="read" disabled={isPending}>
          Read
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

