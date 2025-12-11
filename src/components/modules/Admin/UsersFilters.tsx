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
import { X } from "lucide-react";

export default function UsersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const status = searchParams.get("status") || "all";
  const role = searchParams.get("role") || "all";
  const active = searchParams.get("active") || "all";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
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
    status !== "all" || role !== "all" || active !== "all" || searchParams.get("search");

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px]">
        <SearchFilter placeholder="Search users..." paramName="search" />
      </div>

      <Select
        value={status}
        onValueChange={(value) => handleFilterChange("status", value)}
        disabled={isPending}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="SUSPENDED">Suspended</SelectItem>
          <SelectItem value="DELETED">Deleted</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={role}
        onValueChange={(value) => handleFilterChange("role", value)}
        disabled={isPending}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="USER">User</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={active}
        onValueChange={(value) => handleFilterChange("active", value)}
        disabled={isPending}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Active" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="true">Active Only</SelectItem>
          <SelectItem value="false">Inactive Only</SelectItem>
        </SelectContent>
      </Select>

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
  );
}

