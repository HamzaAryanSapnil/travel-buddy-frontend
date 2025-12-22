import HeroSkeleton from "@/components/modules/Home/HeroSkeleton";
import FeaturedPlansSectionSkeleton from "@/components/modules/Home/FeaturedPlansSectionSkeleton";

export default function HomeLoading() {
  return (
    <main>
      <HeroSkeleton />
      <FeaturedPlansSectionSkeleton />
    </main>
  );
}

