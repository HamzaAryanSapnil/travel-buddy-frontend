"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

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

const DashboardTravelPlansFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentType = searchParams.get("type") || "all";

  const handleTypeChange = (type: "all" | "future" | "past") => {
    const params = new URLSearchParams(searchParams.toString());

    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }

    params.set("page", "1"); // Reset to first page

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-4">
      {/* Type Filter (All / Future / Past) */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={currentType === "all" ? "default" : "ghost"}
            size="sm"
            className="h-8"
            onClick={() => handleTypeChange("all")}
            disabled={isPending}
          >
            All
          </Button>
          <Button
            variant={currentType === "future" ? "default" : "ghost"}
            size="sm"
            className="h-8"
            onClick={() => handleTypeChange("future")}
            disabled={isPending}
          >
            Future
          </Button>
          <Button
            variant={currentType === "past" ? "default" : "ghost"}
            size="sm"
            className="h-8"
            onClick={() => handleTypeChange("past")}
            disabled={isPending}
          >
            Past
          </Button>
        </div>
      </div>

      {/* Other Filters */}
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
        <ClearFiltersButton
          excludeFromCount={["page", "limit", "sort", "type"]}
          preserveParams={[]}
        />
      </div>
    </div>
  );
};

export default DashboardTravelPlansFilters;

