import { ROUTES } from "@/constants/routes";

export const HERO_SLIDE_INTERVAL_MS = 7000;

export const HERO_SLIDES = [
  {
    image: "hero" as const,
    headline: "Plan, collaborate, and explore together.",
    subtext:
      "Our mission is to empower travelers to create unforgettable experiences by providing intelligent tools for planning, collaboration, and organization.",
    primary: { label: "Get Started", href: ROUTES.REGISTER },
    secondary: { label: "Explore plans", href: ROUTES.TRAVEL_PLANS },
  },
  {
    image: "about" as const,
    headline: "AI itineraries for group trips.",
    subtext:
      "Planning trips, especially group trips, is often complicated and time-consuming.",
    primary: { label: "About", href: ROUTES.ABOUT },
    secondary: { label: "AI planner", href: ROUTES.DASHBOARD_PLANNER },
  },
  {
    image: "hero" as const,
    headline: "Itinerary, expenses, meetups, and photos in one place.",
    subtext:
      "Travel Buddy brings everything together - itineraries, expenses, media galleries, meetups, and reviews - all in one comprehensive platform.",
    primary: { label: "Contact", href: ROUTES.CONTACT },
    secondary: { label: "See plans", href: ROUTES.TRAVEL_PLANS },
  },
] as const;

export const FALLBACK_DESTINATIONS = [
  "Cox's Bazar",
  "Sylhet",
  "Bandarban",
  "Sundarbans",
] as const;

export const HOME_CURATED_REVIEWS = [
  {
    quote:
      "I mapped a weekend in Cox's Bazar and kept the dates, budget, and notes in one plan.",
    role: "Solo traveler",
    destination: "Cox's Bazar",
  },
  {
    quote:
      "We agreed on Sylhet before we booked anything, and the shared plan kept both of us on the same list.",
    role: "Couple traveler",
    destination: "Sylhet",
  },
  {
    quote:
      "Planning Bandarban with the family was easier once the itinerary and costs lived in one place.",
    role: "Family traveler",
    destination: "Bandarban",
  },
  {
    quote:
      "The Sundarbans plan held the boat timing and the shared costs, so the group stopped guessing.",
    role: "Group traveler",
    destination: "Sundarbans",
  },
  {
    quote:
      "I kept the Cox's Bazar days in order and checked them off as we went.",
    role: "Weekend traveler",
    destination: "Cox's Bazar",
  },
  {
    quote:
      "Sylhet tea gardens were easier to share once the notes lived on the plan.",
    role: "Friend group",
    destination: "Sylhet",
  },
  {
    quote:
      "Bandarban stays and the hill stops stayed on one list for the whole family.",
    role: "Family traveler",
    destination: "Bandarban",
  },
  {
    quote:
      "We split the Sundarbans budget before we left, and nobody had to chase a receipt.",
    role: "Couple traveler",
    destination: "Sundarbans",
  },
  {
    quote:
      "A short Cox's Bazar trip still needed dates and a budget, and the plan kept both.",
    role: "Solo traveler",
    destination: "Cox's Bazar",
  },
  {
    quote:
      "The Sylhet weekend had a meetup and the photos in the same place as the itinerary.",
    role: "Group traveler",
    destination: "Sylhet",
  },
] as const;