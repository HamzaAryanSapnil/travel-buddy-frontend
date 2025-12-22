"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/services/auth/logoutUser";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { checkAuthStatus } from "@/services/auth/checkAuthStatus";

export default function AuthButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const isAuthenticated = await checkAuthStatus();
      console.log("isAuthenticated from auth buttons: ", isAuthenticated)
      setIsLoggedIn(isAuthenticated);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    // Initial check
    checkAuth();

    // Check if redirected after login
    const loggedIn = searchParams.get("loggedIn");
    if (loggedIn === "true") {
      checkAuth();
      // Remove the query parameter from URL
      const newUrl = `${pathname}`;
      window.history.replaceState({}, "", newUrl);
    }

    // Listen for focus events (when user comes back to tab)
    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener("focus", handleFocus);

    // Listen for custom auth event (dispatch this after login)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, [checkAuth, pathname, searchParams]);

  const handleLogout = async () => {
    await logoutUser();
    setIsLoggedIn(false);

    // Dispatch event
    window.dispatchEvent(new Event("auth-changed"));

    router.push("/login");
    router.refresh();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled className="w-[100px] opacity-50">
          <span className="opacity-0">Loading</span>
        </Button>
      </div>
    );
  }

  // Logged in state
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    );
  }

  // Logged out state
  return (
    <Link href="/login">
      <Button variant="outline">Login</Button>
    </Link>
  );
}
