import { ROUTES } from "@/constants/routes";
import Link from "next/link";

import AuthButtons from "@/components/shared/AuthButton";
import { ModeToggle } from "@/components/shared/ModeToggle";
import MobileMenu from "./MobileMenu";
import DashboardLink from "@/components/shared/ClientDashboardLink";

const PublicNavbar = async () => {
    
  const navItems = [
    { href: ROUTES.HOME, label: "Home" },
    { href: ROUTES.TRAVEL_PLANS, label: "All Plans" },
    { href: ROUTES.ABOUT, label: "About Us" },
    { href: ROUTES.CONTACT, label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur dark:bg-background/95">
      <div className="container mx-auto flex h-[4.5rem] items-center justify-between px-4 md:px-6">
        <Link href={ROUTES.HOME} className="flex items-center space-x-2">
          <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-primary">
            Travel Buddy
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-[-0.01em]">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <DashboardLink />
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <AuthButtons />
          <ModeToggle />
        </div>

        {/* Mobile Menu */}
        <MobileMenu navItems={navItems} />
      </div>
    </header>
  );
};

export default PublicNavbar;
