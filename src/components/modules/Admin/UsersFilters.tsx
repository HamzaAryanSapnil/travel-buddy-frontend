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
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import { X } from "lucide-react";

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Deleted", value: "DELETED" },
];

const ROLE_OPTIONS = [
  { label: "All Roles", value: "all" },
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];

const VERIFICATION_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Verified", value: "true" },
  { label: "Unverified", value: "false" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "createdAt-desc" },
  { label: "Oldest", value: "createdAt-asc" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
];

export default function UsersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const hasActiveFilters =
    (searchParams.get("status") && searchParams.get("status") !== "all") ||
    (searchParams.get("role") && searchParams.get("role") !== "all") ||
    (searchParams.get("isVerified") && searchParams.get("isVerified") !== "all") ||
    searchParams.get("searchTerm") ||
    (searchParams.get("sort") && searchParams.get("sort") !== "createdAt-desc");

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <SearchFilter
          placeholder="Search users..."
          paramName="searchTerm"
        />
      </div>

      {/* Status */}
      <SelectFilter
        paramName="status"
        placeholder="Status"
        defaultValue="all"
        options={STATUS_OPTIONS}
      />

      {/* Role */}
      <SelectFilter
        paramName="role"
        placeholder="Role"
        defaultValue="all"
        options={ROLE_OPTIONS}
      />

      {/* Verification Status */}
      <SelectFilter
        paramName="isVerified"
        placeholder="Verification"
        defaultValue="all"
        options={VERIFICATION_OPTIONS}
      />

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
  );
}

