import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const companions = [
  { type: "SOLO", name: "Solo", line: "A plan you can follow alone" },
  { type: "COUPLE", name: "Couple", line: "Two people, one itinerary" },
  { type: "FAMILY", name: "Family", line: "Days that work for everyone" },
  { type: "FRIENDS", name: "Friends", line: "Split the planning" },
] as const;

export default function WhoYouTravelWith() {
  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Who you are going with
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {companions.map((item) => (
            <Link
              key={item.type}
              href={`${ROUTES.TRAVEL_PLANS}?travelType=${item.type}`}
              className="block rounded-lg border border-border bg-card p-6 text-card-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <h2 className="text-4xl font-[600] tracking-[-0.02em]">
                {item.name}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">{item.line}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}