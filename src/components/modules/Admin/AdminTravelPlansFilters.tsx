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
import { Checkbox } from "@/components/ui/checkbox";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import { X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const TRAVEL_TYPE_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "Solo", value: "SOLO" },
  { label: "Couple", value: "COUPLE" },
  { label: "Family", value: "FAMILY" },
  { label: "Friends", value: "FRIENDS" },
  { label: "Group", value: "GROUP" },
];

const VISIBILITY_OPTIONS = [
  { label: "All Visibility", value: "all" },
  { label: "Public", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
  { label: "Unlisted", value: "UNLISTED" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "createdAt-desc" },
  { label: "Oldest", value: "createdAt-asc" },
  { label: "Start Date (Asc)", value: "startDate-asc" },
  { label: "Start Date (Desc)", value: "startDate-desc" },
  { label: "Budget: Low to High", value: "budgetMin-asc" },
  { label: "Budget: High to Low", value: "budgetMin-desc" },
];

export default function AdminTravelPlansFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [ownerId, setOwnerId] = useState(
    searchParams.get("ownerId") || ""
  );
  const isFeatured = searchParams.get("isFeatured") === "true";

  // Debounce ownerId input
  const debouncedOwnerId = useDebounce(ownerId, 500);

  // Update URL when debounced ownerId changes
  useEffect(() => {
    const currentOwnerId = searchParams.get("ownerId") || "";
    if (debouncedOwnerId !== currentOwnerId) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedOwnerId.trim() !== "") {
        params.set("ownerId", debouncedOwnerId.trim());
      } else {
        params.delete("ownerId");
      }
      params.set("page", "1");
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    }
  }, [debouncedOwnerId, searchParams, router]);

  // Sync local state with URL params when they change externally
  useEffect(() => {
    const urlOwnerId = searchParams.get("ownerId") || "";
    if (urlOwnerId !== ownerId) {
      setOwnerId(urlOwnerId);
    }
  }, [searchParams, ownerId]);

  const handleIsFeaturedChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("isFeatured", "true");
    } else {
      params.delete("isFeatured");
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const hasActiveFilters =
    searchParams.get("searchTerm") ||
    searchParams.get("travelType") ||
    searchParams.get("visibility") ||
    isFeatured ||
    ownerId;

  return (
    <div className="space-y-4">
      {/* Admin-specific filters row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-[200px]">
          <Input
            placeholder="Owner ID (UUID)"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFeatured"
            checked={isFeatured}
            onCheckedChange={handleIsFeaturedChange}
            disabled={isPending}
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Featured Only
          </label>
        </div>
      </div>

      {/* Standard filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search by title or destination..."
          />
        </div>

        {/* Travel Type */}
        <SelectFilter
          paramName="travelType"
          placeholder="Travel Type"
          defaultValue="all"
          options={TRAVEL_TYPE_OPTIONS}
        />

        {/* Visibility */}
        <SelectFilter
          paramName="visibility"
          placeholder="Visibility"
          defaultValue="all"
          options={VISIBILITY_OPTIONS}
        />

        {/* Sort By */}
        <SelectFilter
          paramName="sort"
          placeholder="Sort By"
          defaultValue="createdAt-desc"
          options={SORT_OPTIONS}
        />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOwnerId("");
              startTransition(() => {
                router.push("?");
              });
            }}
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

