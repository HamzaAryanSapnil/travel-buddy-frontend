import { ROUTES } from "@/constants/routes";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

/**
 * Get common navigation items for all roles
 */
export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  const profileHref =
    role === "ADMIN" ? ROUTES.ADMIN_PROFILE : ROUTES.DASHBOARD_PROFILE;

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
          href: profileHref,
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
        href: ROUTES.DASHBOARD_TRAVEL_PLANS,
        icon: "Map",
        roles: ["USER"],
      },
      {
        title: "Create Travel Plan",
        href: ROUTES.DASHBOARD_TRAVEL_PLANS_CREATE,
        icon: "PlusCircle",
        roles: ["USER"],
      },
      {
        title: "My Requests",
        href: ROUTES.DASHBOARD_MY_REQUESTS,
        icon: "UserPlus", // Or Ticket
        roles: ["USER"],
      },
      {
        title: "AI Planner",
        href: ROUTES.DASHBOARD_PLANNER,
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
        href: ROUTES.DASHBOARD_MEETUPS,
        icon: "Users",
        roles: ["USER"],
      },
      {
        title: "Media Gallery",
        href: ROUTES.DASHBOARD_MEDIA,
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
        href: ROUTES.DASHBOARD_SUBSCRIPTIONS,
        icon: "CreditCard",
        roles: ["USER"],
      },
      {
        title: "Payments",
        href: ROUTES.DASHBOARD_PAYMENTS,
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
        href: ROUTES.DASHBOARD_NOTIFICATIONS,
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
        href: ROUTES.ADMIN_USERS,
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
        href: ROUTES.ADMIN_TRAVEL_PLANS,
        icon: "Map",
        roles: ["ADMIN"],
      },
      {
        title: "Manage Travel Plans",
        href: ROUTES.ADMIN_TRAVEL_PLANS_MANAGE,
        icon: "Table",
        roles: ["ADMIN"],
      },
      {
        title: "All Subscriptions",
        href: ROUTES.ADMIN_SUBSCRIPTIONS,
        icon: "CreditCard",
        roles: ["ADMIN"],
      },
      {
        title: "Payment Statistics",
        href: ROUTES.ADMIN_PAYMENTS,
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
