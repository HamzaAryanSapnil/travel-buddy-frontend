"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import AuthButtons from "./AuthButton";
import { ModeToggle } from "./ModeToggle";
import { checkAuthStatus } from "@/services/auth/checkAuthStatus";

interface MobileMenuProps {
  navItems: Array<{ href: string; label: string }>;
}

export default function MobileMenu({ navItems }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const fetchAuthStatus = async () => {
      const isAuthenticated = await checkAuthStatus();
      setIsLoggedIn(isAuthenticated);
    };
    fetchAuthStatus();
  }, []);
  // Auto-close when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      // Check if screen is now desktop size (md breakpoint = 768px)
      if (window.innerWidth >= 768) {
        setTimeout(() => {
          setOpen(false);
        }, 0);
      }
    };

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    // Also check on mount in case screen is already desktop size
    if (window.innerWidth >= 768) {
      setTimeout(() => {
        setOpen(false);
      }, 0);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[400px] max-w-[90vw] p-4"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <nav className="flex flex-col space-y-4 mt-8">
            {navItems.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-lg font-medium hover:text-primary"
                onClick={() => setOpen(false)} // Close on link click
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-4 flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                {isLoggedIn && (
                  <Link
                    href="/dashboard"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setOpen(false)} // Close on link click
                  >
                    Dashboard
                  </Link>
                )}
                <AuthButtons />
                <ModeToggle />
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
