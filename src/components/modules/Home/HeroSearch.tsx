"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HeroSearch() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = String(formData.get("searchTerm") ?? "").trim();
    const travelType = String(formData.get("travelType") ?? "").trim();

    const params = new URLSearchParams();
    if (searchTerm) {
      params.set("searchTerm", searchTerm);
    }
    if (travelType) {
      params.set("travelType", travelType);
    }

    const query = params.toString();
    router.push(
      query ? `${ROUTES.TRAVEL_PLANS}?${query}` : ROUTES.TRAVEL_PLANS
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-card text-card-foreground shadow-xl p-4 sm:p-6 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end"
    >
      <div className="grid gap-1.5 text-left">
        <label htmlFor="home-destination" className="text-sm font-medium">
          Destination
        </label>
        <Input
          id="home-destination"
          name="searchTerm"
          type="text"
          placeholder="Where do you want to go?"
        />
      </div>
      <div className="grid gap-1.5 text-left">
        <label htmlFor="home-travel-type" className="text-sm font-medium">
          Travel type
        </label>
        <select
          id="home-travel-type"
          name="travelType"
          defaultValue=""
          className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm text-card-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          <option value="">Any type</option>
          <option value="SOLO">Solo</option>
          <option value="COUPLE">Couple</option>
          <option value="FAMILY">Family</option>
          <option value="FRIENDS">Friends</option>
          <option value="GROUP">Group</option>
        </select>
      </div>
      <Button type="submit" className="h-9">
        Search plans
      </Button>
    </form>
  );
}