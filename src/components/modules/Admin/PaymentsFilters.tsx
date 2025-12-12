"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import SearchFilter from "@/components/shared/SearchFilter";
import { X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function PaymentsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const status = searchParams.get("status") || "all";
  const [subscriptionId, setSubscriptionId] = useState(
    searchParams.get("subscriptionId") || ""
  );
  const [currency, setCurrency] = useState(
    searchParams.get("currency") || ""
  );

  // Debounce subscriptionId and currency inputs
  const debouncedSubscriptionId = useDebounce(subscriptionId, 500);
  const debouncedCurrency = useDebounce(currency, 500);

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

  // Update URL when debounced values change
  useEffect(() => {
    const currentSubscriptionId = searchParams.get("subscriptionId") || "";
    if (debouncedSubscriptionId !== currentSubscriptionId) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSubscriptionId.trim() !== "") {
        params.set("subscriptionId", debouncedSubscriptionId);
      } else {
        params.delete("subscriptionId");
      }
      params.set("page", "1");
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    }
  }, [debouncedSubscriptionId, searchParams, router]);

  useEffect(() => {
    const currentCurrency = searchParams.get("currency") || "";
    if (debouncedCurrency !== currentCurrency) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedCurrency.trim() !== "") {
        params.set("currency", debouncedCurrency);
      } else {
        params.delete("currency");
      }
      params.set("page", "1");
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    }
  }, [debouncedCurrency, searchParams, router]);

  // Sync local state with URL params when they change externally
  useEffect(() => {
    const urlSubscriptionId = searchParams.get("subscriptionId") || "";
    const urlCurrency = searchParams.get("currency") || "";
    if (urlSubscriptionId !== subscriptionId) {
      setSubscriptionId(urlSubscriptionId);
    }
    if (urlCurrency !== currency) {
      setCurrency(urlCurrency);
    }
  }, [searchParams, subscriptionId, currency]);

  const clearFilters = () => {
    setSubscriptionId("");
    setCurrency("");
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
            onChange={(e) => setSubscriptionId(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="w-[150px]">
          <Input
            placeholder="Currency (e.g., USD)"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
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

