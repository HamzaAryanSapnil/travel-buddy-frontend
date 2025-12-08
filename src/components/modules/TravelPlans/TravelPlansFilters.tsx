"use client";

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

const FEATURED_OPTIONS = [
  { label: "All Plans", value: "all" },
  { label: "Featured Only", value: "true" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "createdAt-desc" },
  { label: "Oldest", value: "createdAt-asc" },
  { label: "Start Date", value: "startDate-asc" },
  { label: "Budget: Low to High", value: "budgetMin-asc" },
  { label: "Budget: High to Low", value: "budgetMin-desc" },
];

const TravelPlansFilters = () => {

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search plans by destination, title..."
          />
        </div>

        {/* Travel Type */}
        <SelectFilter
          paramName="travelType"
          placeholder="Travel Type"
          defaultValue="all"
          options={TRAVEL_TYPE_OPTIONS}
        />

        {/* Featured */}
        <SelectFilter
          paramName="isFeatured"
          placeholder="Featured"
          defaultValue="all"
          options={FEATURED_OPTIONS}
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
          excludeFromCount={["page", "limit", "sort"]}
          preserveParams={[]}
        />
      </div>
    </div>
  );
};

export default TravelPlansFilters;

