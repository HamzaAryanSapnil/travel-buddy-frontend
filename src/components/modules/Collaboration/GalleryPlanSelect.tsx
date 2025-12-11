"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface GalleryPlanSelectProps {
  plans: Array<{ id: string; title: string }>;
  selectedPlanId?: string;
}

export default function GalleryPlanSelect({
  plans,
  selectedPlanId,
}: GalleryPlanSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("planId", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="planId">Select Plan</Label>
      <Select onValueChange={handleChange} value={selectedPlanId}>
        <SelectTrigger id="planId" className="w-full sm:w-80">
          <SelectValue placeholder="Choose a plan" />
        </SelectTrigger>
        <SelectContent>
          {plans.map((plan) => (
            <SelectItem key={plan.id} value={plan.id}>
              {plan.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

