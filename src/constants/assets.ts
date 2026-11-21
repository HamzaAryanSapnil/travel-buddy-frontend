import heroImage from "@/assets/images/travel-buddy-hero.jpg";
import aboutImage from "@/assets/images/travel-buddy-about.webp";

export const ASSETS = {
  hero: {
    image: heroImage,
    alt: "Travel destination with mountains",
    sizes: "100vw",
  },
  about: {
    image: aboutImage,
    alt: "/assets/images/travel-buddy-about.jpg",
    sizes: "100vw",
  },
  cover: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  },
};