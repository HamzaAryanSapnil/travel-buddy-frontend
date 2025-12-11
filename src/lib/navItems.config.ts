import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

/**
 * Get common navigation items for all roles
 */
export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      items: [
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
          roles: ["USER", "ADMIN"],
        },
        {
          title: "My Profile",
          href: "/dashboard/profile",
          icon: "User",
          roles: ["USER", "ADMIN"],
        },
      ],
    },
  ];
};

/**
 * User navigation items
 */
export const userNavItems: NavSection[] = [
  {
    title: "Travel Planning",
    items: [
      {
        title: "My Travel Plans",
        href: "/dashboard/travel-plans",
        icon: "Map",
        roles: ["USER"],
      },
      {
        title: "Create Travel Plan",
        href: "/dashboard/travel-plans/create",
        icon: "PlusCircle",
        roles: ["USER"],
      },
      {
        title: "My Requests",
        href: "/dashboard/my-requests",
        icon: "UserPlus", // Or Ticket
        roles: ["USER"],
      },
      {
        title: "AI Planner",
        href: "/dashboard/planner",
        icon: "Sparkles",
        roles: ["USER"],
      },
    ],
  },
  {
    title: "Collaboration",
    items: [
      {
        title: "Meetups",
        href: "/dashboard/meetups",
        icon: "Users",
        roles: ["USER"],
      },
      {
        title: "Media Gallery",
        href: "/dashboard/media",
        icon: "Image",
        roles: ["USER"],
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        title: "Subscriptions",
        href: "/dashboard/subscriptions",
        icon: "CreditCard",
        roles: ["USER"],
      },
      {
        title: "Payments",
        href: "/dashboard/payments",
        icon: "Receipt",
        roles: ["USER"],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: "Bell",
        badge: "unread", // Will be replaced with actual count
        roles: ["USER"],
      },
    ],
  },
];

/**
 * Admin navigation items
 */
export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "All Users",
        href: "/admin/dashboard/users",
        icon: "Users",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "System Management",
    items: [
      {
        title: "All Travel Plans",
        href: "/admin/dashboard/travel-plans",
        icon: "Map",
        roles: ["ADMIN"],
      },
      {
        title: "All Subscriptions",
        href: "/admin/dashboard/subscriptions",
        icon: "CreditCard",
        roles: ["ADMIN"],
      },
      {
        title: "Payment Statistics",
        href: "/admin/dashboard/payments",
        icon: "BarChart",
        roles: ["ADMIN"],
      },
    ],
  },
];

/**
 * Get navigation items based on user role
 */
export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];
    case "USER":
      return [...commonNavItems, ...userNavItems];
    default:
      return commonNavItems;
  }
};

