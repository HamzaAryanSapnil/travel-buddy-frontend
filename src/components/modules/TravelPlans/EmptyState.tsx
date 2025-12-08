import { Button } from "@/components/ui/button";
import { Plane, Search, Inbox } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
}

const EmptyState = ({
  title = "No travel plans found",
  description = "Try adjusting your filters or create a new plan!",
  icon,
  action,
}: EmptyStateProps) => {
  const defaultIcon = <Plane className="h-16 w-16 text-muted-foreground" />;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4">{icon || defaultIcon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <Button asChild>
          <Link href={action.href} onClick={action.onClick}>
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

