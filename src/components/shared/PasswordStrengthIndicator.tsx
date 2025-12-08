"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

type PasswordRequirement = {
  label: string;
  test: (password: string) => boolean;
};

const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  const requirements: PasswordRequirement[] = useMemo(
    () => [
      {
        label: "At least 8 characters",
        test: (pwd: string) => pwd.length >= 8,
      },
      {
        label: "At least 1 uppercase letter",
        test: (pwd: string) => /[A-Z]/.test(pwd),
      },
      {
        label: "At least 1 number",
        test: (pwd: string) => /[0-9]/.test(pwd),
      },
      {
        label: "At least 1 special character",
        test: (pwd: string) => /[!@#$%^&*]/.test(pwd),
      },
    ],
    []
  );

  const metRequirements = useMemo(() => {
    return requirements.filter((req) => req.test(password));
  }, [password, requirements]);

  const strength = useMemo(() => {
    const metCount = metRequirements.length;
    if (metCount === 0) return "none";
    if (metCount <= 2) return "weak";
    if (metCount === 3) return "medium";
    return "strong";
  }, [metRequirements.length]);

  const strengthConfig = {
    none: { label: "", color: "bg-muted", textColor: "text-muted-foreground" },
    weak: { label: "Weak", color: "bg-destructive", textColor: "text-destructive" },
    medium: { label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-600 dark:text-yellow-500" },
    strong: { label: "Strong", color: "bg-green-500", textColor: "text-green-600 dark:text-green-500" },
  };

  const currentConfig = strengthConfig[strength];

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              currentConfig.color,
              metRequirements.length === 0 && "w-0",
              metRequirements.length === 1 && "w-1/4",
              metRequirements.length === 2 && "w-2/4",
              metRequirements.length === 3 && "w-3/4",
              metRequirements.length === 4 && "w-full"
            )}
          />
        </div>
        {strength !== "none" && (
          <span className={cn("text-sm font-medium", currentConfig.textColor)}>
            {currentConfig.label}
          </span>
        )}
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <div
              key={index}
              className="flex items-center gap-2 text-sm"
            >
              {isMet ? (
                <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  isMet
                    ? "text-green-600 dark:text-green-500"
                    : "text-muted-foreground"
                )}
              >
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;

