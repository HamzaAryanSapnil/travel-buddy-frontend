import { getNavItemsByRole } from "@/lib/navItems.config";
import { getUserInfo } from "@/lib/actions/auth.action";

import DashboardSidebarContent from "./DashboardSidebarContent";

const DashboardSidebar = async () => {
  const userInfo = await getUserInfo();

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);

  return <DashboardSidebarContent userInfo={userInfo} navItems={navItems} />;
};

export default DashboardSidebar;
