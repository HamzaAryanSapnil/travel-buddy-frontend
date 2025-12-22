"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import ClearFiltersButton from "@/components/shared/ClearFiltersButton";

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

export default function TravelPlansTableFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isFeatured = searchParams.get("isFeatured") === "true";

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
    (searchParams.get("travelType") && searchParams.get("travelType") !== "all") ||
    (searchParams.get("visibility") && searchParams.get("visibility") !== "all") ||
    isFeatured ||
    (searchParams.get("sort") && searchParams.get("sort") !== "createdAt-desc");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <SearchFilter
            placeholder="Search by title or destination..."
            paramName="searchTerm"
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

        {/* Featured Filter */}
        <div className="flex items-center space-x-2 px-3 py-2 border rounded-md">
          <Checkbox
            id="isFeatured"
            checked={isFeatured}
            onCheckedChange={handleIsFeaturedChange}
            disabled={isPending}
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Featured Only
          </label>
        </div>

        {/* Sort */}
        <SelectFilter
          paramName="sort"
          placeholder="Sort By"
          defaultValue="createdAt-desc"
          options={SORT_OPTIONS}
        />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <ClearFiltersButton
            excludeFromCount={["page", "limit", "sort"]}
            preserveParams={[]}
          />
        )}
      </div>
    </div>
  );
}

