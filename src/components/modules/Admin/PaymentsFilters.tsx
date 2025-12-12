"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchFilter from "@/components/shared/SearchFilter";
import { X } from "lucide-react";

export default function PaymentsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const status = searchParams.get("status") || "all";
  const subscriptionId = searchParams.get("subscriptionId") || "";
  const currency = searchParams.get("currency") || "";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value.trim() !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to first page
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push("?");
    });
  };

  const hasActiveFilters =
    status !== "all" ||
    searchParams.get("search") ||
    subscriptionId ||
    currency;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <SearchFilter placeholder="Search by user..." paramName="search" />
        </div>

        <Select
          value={status}
          onValueChange={(value) => handleFilterChange("status", value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="SUCCEEDED">Succeeded</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-[200px]">
          <Input
            placeholder="Subscription ID"
            value={subscriptionId}
            onChange={(e) => handleFilterChange("subscriptionId", e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="w-[150px]">
          <Input
            placeholder="Currency (e.g., USD)"
            value={currency}
            onChange={(e) => handleFilterChange("currency", e.target.value)}
            disabled={isPending}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            disabled={isPending}
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

