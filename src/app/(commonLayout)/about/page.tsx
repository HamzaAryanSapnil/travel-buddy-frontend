import type { Metadata } from "next";
import Link from "next/link";
import { developerInfo } from "@/config/developer.config";
import { projectConfig } from "@/config/project.config";
import AboutUsContent from "@/components/modules/About/AboutUsContent";
import DeveloperSection from "@/components/modules/About/DeveloperSection";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "About Us",
  description: "Plan, Collaborate, and Explore Together!",
};

// Force static rendering - about page has no server-side dependencies
export const dynamic = 'force-static';

export default function AboutPage() {
  return (
    <main className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            {projectConfig.mission.title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {projectConfig.projectTagline}
          </p>
        </header>
        <AboutUsContent />
        <DeveloperSection developerInfo={developerInfo} />
        <div className="mt-16 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href={ROUTES.TRAVEL_PLANS}>Explore plans</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.CONTACT}>Contact</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.REGISTER}>Create an account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}