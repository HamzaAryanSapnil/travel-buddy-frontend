"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, useRef } from "react";
import { Input } from "../ui/input";

interface SearchFilterProps {
  placeholder?: string;
  paramName?: string;
}

const SearchFilter = ({
  placeholder = "Search...",
  paramName = "searchTerm",
}: SearchFilterProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) || "");
  // Track if URL update came from our debounced change
  const isInternalUpdateRef = useRef(false);
  // Track previous URL value to detect external changes
  const previousUrlValueRef = useRef(searchParams.get(paramName) || "");
  // Increased debounce delay to 800ms for better UX (prevents too frequent searches)
  const debouncedValue = useDebounce(value, 800);

  // Update URL when debounced value changes
  useEffect(() => {
    const currentValue = searchParams.get(paramName) || "";

    // Skip if URL was just changed externally (by checking if URL value matches previous ref)
    // This prevents debounced value from re-adding params after clear
    if (
      !isInternalUpdateRef.current &&
      currentValue !== previousUrlValueRef.current
    ) {
      // URL was changed externally, update ref and skip this update
      previousUrlValueRef.current = currentValue;
      return;
    }

    // Only update if debounced value is different from current URL param
    if (debouncedValue.trim() === currentValue.trim()) {
      // Still update the ref even if no change needed
      previousUrlValueRef.current = currentValue;
      return;
    }

    // Mark this as an internal update
    isInternalUpdateRef.current = true;

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedValue.trim()) {
      params.set(paramName, debouncedValue.trim());
      params.set("page", "1"); // Reset to first page on search
    } else {
      params.delete(paramName);
      params.set("page", "1");
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`);
      // Update ref and reset flag after navigation
      previousUrlValueRef.current = debouncedValue.trim();
      setTimeout(() => {
        isInternalUpdateRef.current = false;
      }, 100);
    });
  }, [debouncedValue, paramName, router, searchParams]);

  // Sync local state with URL params when they change externally
  // (e.g., when ClearFiltersButton is clicked or URL is changed manually)
  useEffect(() => {
    const urlValue = searchParams.get(paramName) || "";

    // Check if URL changed externally (not from our debounced update)
    const isExternalChange = urlValue !== previousUrlValueRef.current;

    if (!isExternalChange || isInternalUpdateRef.current) {
      // Update ref even if we skip the update
      previousUrlValueRef.current = urlValue;
      return;
    }

    // This is an external change (e.g., clear button clicked)
    // Update ref first to prevent re-triggering
    previousUrlValueRef.current = urlValue;

    // Immediately sync the local state to match URL
    // This will cause debouncedValue to eventually sync too
    startTransition(() => {
      setValue(urlValue);
    });
  }, [searchParams, paramName]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
      />
    </div>
  );
};

export default SearchFilter;
