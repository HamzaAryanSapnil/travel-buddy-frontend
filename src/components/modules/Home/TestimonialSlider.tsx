"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { HOME_CURATED_REVIEWS } from "@/constants/home";

type ApiReviewRow = {
  rating: number;
  comment: string;
  reviewerName: string | null;
  destination: string | null;
};

type CuratedCard = {
  kind: "curated";
  quote: string;
  role: string;
  destination: string;
};

type RealCard = {
  kind: "real";
  quote: string;
  name: string;
  destination: string | null;
  rating: number;
};

type ReviewCard = CuratedCard | RealCard;

function curatedToCards(): ReviewCard[] {
  return HOME_CURATED_REVIEWS.map((item) => ({
    kind: "curated" as const,
    quote: item.quote,
    role: item.role,
    destination: item.destination,
  }));
}

function MarqueeStyles() {
  return (
    <style>{`
      @keyframes home-review-marquee {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-50%);
        }
      }

      .home-review-marquee-track {
        display: flex;
        width: max-content;
      }

      .home-review-marquee-track--animate > article {
        margin-right: 1rem;
      }

      @media (prefers-reduced-motion: no-preference) {
        .home-review-marquee-track--animate {
          animation: home-review-marquee 60s linear infinite;
        }

        .home-review-marquee:hover .home-review-marquee-track--animate {
          animation-play-state: paused;
        }
      }
    `}</style>
  );
}

function StarRating({ card }: { card: ReviewCard }) {
  if (card.kind === "curated") {
    return (
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className="size-4 fill-primary text-primary"
          />
        ))}
      </div>
    );
  }

  const rating = Math.min(5, Math.max(0, Math.round(card.rating)));

  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "size-4 fill-primary text-primary"
              : "size-4 text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

function ReviewCardView({
  card,
  snap,
  ariaHidden,
}: {
  card: ReviewCard;
  snap?: boolean;
  ariaHidden?: boolean;
}) {
  const attribution =
    card.kind === "real"
      ? card.name.trim() || "Traveler"
      : card.role;

  return (
    <article
      aria-hidden={ariaHidden || undefined}
      className={`bg-card text-card-foreground w-[320px] shrink-0 rounded-lg border p-5 flex flex-col gap-3 ${
        snap ? "snap-start" : ""
      }`}
    >
      <StarRating card={card} />
      <p className="text-sm leading-relaxed flex-1">{card.quote}</p>
      <footer className="text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{attribution}</p>
        {card.destination?.trim() ? (
          <p>{card.destination.trim()}</p>
        ) : null}
      </footer>
    </article>
  );
}

export default function TestimonialSlider() {
  const [cards, setCards] = useState<ReviewCard[]>(curatedToCards);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const base =
      process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

    fetch(`${base}/reviews/public`, { credentials: "omit" })
      .then((res) => {
        if (!res.ok) throw new Error("reviews fetch failed");
        return res.json() as Promise<{ data: ApiReviewRow[] }>;
      })
      .then((json) => {
        if (cancelled || !Array.isArray(json.data)) return;

        const real: RealCard[] = [];
        for (const row of json.data) {
          if (real.length >= 10) break;
          const quote = row.comment?.trim();
          if (!quote) continue;
          real.push({
            kind: "real",
            quote,
            name: row.reviewerName?.trim() ?? "",
            destination: row.destination,
            rating: row.rating,
          });
        }

        if (real.length >= 10) {
          setCards(real.slice(0, 10));
          return;
        }

        const fill = HOME_CURATED_REVIEWS.slice(0, 10 - real.length).map(
          (item) => ({
            kind: "curated" as const,
            quote: item.quote,
            role: item.role,
            destination: item.destination,
          })
        );
        setCards([...real, ...fill]);
      })
      .catch(() => {
        /* keep curated quotes */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayCards = useMemo(() => cards.slice(0, 10), [cards]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <MarqueeStyles />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          What travelers say
        </h2>

        {reducedMotion ? (
          <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            {displayCards.map((card, index) => (
              <ReviewCardView
                key={`${card.kind}-${index}`}
                card={card}
                snap
              />
            ))}
          </div>
        ) : (
          <div className="home-review-marquee mt-8 overflow-hidden">
            <div className="home-review-marquee-track home-review-marquee-track--animate">
              {displayCards.map((card, index) => (
                <ReviewCardView
                  key={`a-${card.kind}-${index}`}
                  card={card}
                />
              ))}
              {displayCards.map((card, index) => (
                <ReviewCardView
                  key={`b-${card.kind}-${index}`}
                  card={card}
                  ariaHidden
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}