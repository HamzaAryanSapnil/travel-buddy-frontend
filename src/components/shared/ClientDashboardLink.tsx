"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { checkAuthStatus } from "@/services/auth/checkAuthStatus";

export default function DashboardLink() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const isAuthenticated = await checkAuthStatus();
      setIsLoggedIn(isAuthenticated);
    } catch (error) {
      console.error("Error checking auth status: ", error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  // Loading state - empty space to avoid layout shift
  if (isLoading) {
    return <div className="w-[80px]"></div>;
  }

  // Only show if logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <Link
      href="/dashboard"
      className="text-foreground hover:text-primary transition-colors"
    >
      Dashboard
    </Link>
  );
}
