import Link from "next/link";
import { developerInfo } from "@/config/developer.config";
import { projectConfig } from "@/config/project.config";
import { FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa";

function PublicFooter() {
  return (
    <footer className="border-t bg-background w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Column */}
          <div>
            <h3 className="font-bold mb-2">{projectConfig.projectName}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {projectConfig.projectTagline}
            </p>
          </div>

          {/* Links Column */}
          <div className="lg:justify-self-center">
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/travel-plans"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Travel Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:justify-self-center">
            <h3 className="font-semibold mb-2">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Info Column */}
          <div className="lg:justify-self-end">
            <h3 className="font-semibold mb-2">Developer</h3>
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm font-medium mb-1">{developerInfo.name}</p>
                <p className="text-xs text-muted-foreground">
                  {developerInfo.title}
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href={developerInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-muted-foreground hover:text-[#25D366] transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>
                <a
                  href={developerInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-muted-foreground hover:text-[#0077B5] transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href={developerInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-muted-foreground hover:text-[#181717] transition-colors"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-sm text-muted-foreground">
                <a
                  href={`mailto:${developerInfo.email}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {developerInfo.email}
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {projectConfig.projectName}. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
