import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  value: string | number;
  label: string;
  icon: LucideIcon;
  href?: string;
  color?: "blue" | "green" | "orange" | "purple" | "teal" | "pink" | "red";
  badge?: string;
}

const colorClasses = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  orange: "text-orange-600 dark:text-orange-400",
  purple: "text-purple-600 dark:text-purple-400",
  teal: "text-teal-600 dark:text-teal-400",
  pink: "text-pink-600 dark:text-pink-400",
  red: "text-red-600 dark:text-red-400",
};

const StatCard = ({
  value,
  label,
  icon: Icon,
  href,
  color = "blue",
  badge,
}: StatCardProps) => {
  const content = (
    <Card
      className={cn(
        "hover:shadow-md transition-all duration-300",
        href && "cursor-pointer hover:scale-[1.02]"
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {label}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
          </div>
          <div className={cn("p-3 rounded-lg bg-muted", colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export default StatCard;

