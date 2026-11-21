"use client";

import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { checkAuthStatus } from "@/lib/actions/auth.action";

export default function CreatePlanFAB() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await checkAuthStatus();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Don't show button while checking auth or if not authenticated
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Link
      href={ROUTES.DASHBOARD_TRAVEL_PLANS_CREATE}
      className="fixed bottom-8 right-8 z-50"
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="Create New Plan"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  );
}

