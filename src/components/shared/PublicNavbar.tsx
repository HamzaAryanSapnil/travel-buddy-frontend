import Link from "next/link";

import AuthButtons from "./AuthButton";
import { ModeToggle } from "./ModeToggle";
import MobileMenu from "./MobileMenu";
import DashboardLink from "./ClientDashboardLink";

const PublicNavbar = async () => {
    
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/travel-plans", label: "All Plans" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur dark:bg-background/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">Travel Buddy</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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

        <div className="hidden md:flex items-center space-x-2">
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
