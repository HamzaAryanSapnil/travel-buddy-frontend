import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { getUnreadCount } from "@/services/notifications/getUnreadCount";
import { getNotifications } from "@/services/notifications/getNotifications";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { UserInfo } from "@/types/user.interface";
import { Notification } from "@/types/notification.interface";
import DashboardNavbarContent from "./DashboardNavbarContent";

const DashboardNavbar = async () => {
  const userInfo = (await getUserInfo()) as UserInfo;
  const unreadCount = await getUnreadCount();
  const navItems = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  // Fetch recent notifications (unread first, then recent)
  let notifications: Notification[] = [];
  try {
    // Fetch unread notifications first
    const unreadResult = await getNotifications({ isRead: false, limit: 10 });
    if (unreadResult.success) {
      notifications = unreadResult.data || [];
    }

    // If we have less than 10 unread, fetch some read ones
    if (notifications.length < 10) {
      const readResult = await getNotifications({
        isRead: true,
        limit: 10 - notifications.length,
      });
      if (readResult.success && readResult.data) {
        notifications = [...notifications, ...readResult.data];
      }
    }
  } catch (error) {
    // Silently fail - notifications are optional
    console.error("Failed to fetch notifications:", error);
  }

  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      unreadCount={unreadCount}
      navItems={navItems}
      dashboardHome={dashboardHome}
      notifications={notifications}
    />
  );
};

export default DashboardNavbar;

