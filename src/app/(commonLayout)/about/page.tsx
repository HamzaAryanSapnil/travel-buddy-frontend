import { projectConfig } from "@/config/project.config";
import { developerInfo } from "@/config/developer.config";
import AboutUsContent from "@/components/modules/About/AboutUsContent";
import DeveloperSection from "@/components/modules/About/DeveloperSection";

// Force static rendering - about page has no server-side dependencies
export const dynamic = 'force-static';

export default function AboutPage() {
  return (
    <main className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AboutUsContent />
        <DeveloperSection developerInfo={developerInfo} />
      </div>
    </main>
  );
}
