export type UserRole = "USER" | "ADMIN";

// Route configuration for matching routes
export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

// Authentication routes (public, no auth needed)
export const authRoutes = ["/login", "/register"];

// Common protected routes (accessible to all authenticated users)
export const commonProtectedRoutes: RouteConfig = {
  exact: ["/profile", "/settings", "/change-password"],
  patterns: [],
};

// Admin protected routes
export const adminProtectedRoutes: RouteConfig = {
  patterns: [/^\/admin/], // Routes starting with /admin/*
  exact: [],
};

// User dashboard routes
export const userProtectedRoutes: RouteConfig = {
  patterns: [/^\/dashboard/], // Routes starting with /dashboard/*
  exact: [],
};

/**
 * Check if a pathname is an authentication route
 */
export const isAuthRoute = (pathname: string): boolean => {
  return authRoutes.some((route: string) => route === pathname);
};

/**
 * Check if a pathname matches a route configuration
 */
export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
};

/**
 * Get the route owner based on pathname
 * Returns: "ADMIN" | "USER" | "COMMON" | null
 */
export const getRouteOwner = (
  pathname: string
): "ADMIN" | "USER" | "COMMON" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }
  if (isRouteMatches(pathname, userProtectedRoutes)) {
    return "USER";
  }
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  return null;
};

/**
 * Get default dashboard route based on user role
 */
export const getDefaultDashboardRoute = (role: UserRole): string => {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }
  return "/dashboard";
};

/**
 * Check if a redirect path is valid for a user role
 */
export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  if (routeOwner === role) {
    return true;
  }

  return false;
};

