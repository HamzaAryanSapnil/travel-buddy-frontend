import AppImage from "@/components/shared/AppImage";
import { ASSETS } from "@/constants/assets";
import { FALLBACK_DESTINATIONS } from "@/constants/home";
import { ROUTES } from "@/constants/routes";
import { getPublicTravelPlans } from "@/lib/actions/travelPlan.action";
import Link from "next/link";

type DestinationCard = {
  name: string;
  coverPhoto: string | null;
};

function buildDestinations(plans: TravelPlan[]): DestinationCard[] {
  const seen = new Set<string>();
  const destinations: DestinationCard[] = [];

  for (const plan of plans) {
    const name = plan.destination.trim();
    if (!name) continue;

    const key = name.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    const coverPhoto =
      typeof plan.coverPhoto === "string" && plan.coverPhoto.trim()
        ? plan.coverPhoto
        : null;

    destinations.push({ name, coverPhoto });
  }

  if (destinations.length < 4) {
    for (const fallback of FALLBACK_DESTINATIONS) {
      if (destinations.length >= 4) break;

      const key = fallback.toLowerCase();
      if (seen.has(key)) continue;

      seen.add(key);
      destinations.push({ name: fallback, coverPhoto: null });
    }
  }

  return destinations;
}

export default async function DestinationGrid() {
  const result = await getPublicTravelPlans({ limit: 12 });
  const plans = result.success ? (result.data ?? []) : [];
  const destinations = buildDestinations(plans);

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <style>{`
@keyframes plane-climb {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}
.plane-drift {
  offset-path: path("M -32 460 C 180 390, 460 250, 1280 24");
  offset-rotate: auto 90deg;
  offset-distance: 35%;
}
@media (prefers-reduced-motion: no-preference) {
  .plane-drift {
    animation: plane-climb 18s linear infinite;
  }
}
`}</style>
        <svg
          viewBox="0 0 1000 450"
          className="h-full w-full text-primary opacity-[0.22] dark:opacity-[0.35] [&_path]:stroke-primary-foreground [&_path]:stroke-2"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M120 95 L200 75 L280 88 L310 120 L295 165 L250 190 L180 178 L130 150 Z"
          />
          <path
            fill="currentColor"
            d="M195 205 L230 195 L255 240 L240 310 L210 355 L175 330 L165 260 Z"
          />
          <path
            fill="currentColor"
            d="M455 75 L520 65 L560 85 L575 130 L555 175 L500 195 L460 170 L445 115 Z"
          />
          <path
            fill="currentColor"
            d="M480 195 L530 185 L565 220 L570 320 L540 400 L495 395 L465 300 L470 230 Z"
          />
          <path
            fill="currentColor"
            d="M595 55 L720 45 L820 70 L880 120 L860 200 L780 230 L680 210 L610 150 L585 95 Z"
          />
          <path
            fill="currentColor"
            d="M700 255 L780 245 L830 280 L815 350 L760 380 L710 360 L690 300 Z"
          />
          <path
            fill="currentColor"
            d="M830 315 L895 305 L920 335 L905 365 L860 375 L835 345 Z"
          />
        </svg>
        <svg
          viewBox="0 0 1000 450"
          className="absolute inset-0 h-full w-full text-primary"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            d="M40 240 C 160 180, 280 300, 420 220 S 640 150, 820 250 S 940 300, 980 190"
            fill="none"
            stroke="currentColor"
            strokeDasharray="2 6"
            strokeWidth="3"
          />
        </svg>
      </div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Destinations
        </h2>
        <p className="text-muted-foreground mt-2">
          Places people are planning
        </p>

        {destinations.length === 0 ? (
          <p className="mt-8 text-muted-foreground">No destinations yet.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[140px] sm:auto-rows-[160px]">
            {destinations.map(({ name, coverPhoto }, index) => {
              const href = `${ROUTES.TRAVEL_PLANS}?${new URLSearchParams({
                searchTerm: name,
              }).toString()}`;

              const spanClass =
                index === 0 ? " sm:col-span-2 sm:row-span-2" : "";

              return (
                <Link
                  key={`${name}-${index}`}
                  href={href}
                  className={`group relative block overflow-hidden rounded-2xl transition-transform duration-200 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring${spanClass}`}
                >
                  {coverPhoto ? (
                    <AppImage
                      src={coverPhoto}
                      alt={name}
                      fill
                      className="object-cover motion-safe:transition-transform motion-safe:duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03]"
                      sizes={ASSETS.cover.sizes}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-secondary" />
                  )}
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-black/10 dark:ring-white/10" />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4">
                    <span className="text-white font-semibold text-lg">
                      {name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          className="plane-drift absolute left-0 top-0 h-10 w-10 text-primary drop-shadow-sm"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
          />
        </svg>
      </div>
    </section>
  );
}