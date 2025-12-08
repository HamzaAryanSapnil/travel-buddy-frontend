import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

/**
 * Get icon component by name
 * @param iconName - Name of the icon (e.g., "LayoutDashboard", "Map", "Calendar")
 * @returns LucideIcon component or HelpCircle as fallback
 */
export const getIconComponent = (iconName: string): LucideIcon => {
  const IconComponent = Icons[iconName as keyof typeof Icons];

  if (!IconComponent) {
    return Icons.HelpCircle;
  }

  return IconComponent as LucideIcon;
};

