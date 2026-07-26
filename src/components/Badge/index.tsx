import type { HTMLAttributes } from "react";
import { cn } from "@utils/cn";

type BadgeVariant = "success" | "error" | "warning" | "info" | "default";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-700 border-green-200",
  error: "bg-red-100 text-red-700 border-red-200",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  default: "bg-gray-100 text-gray-700 border-gray-200",
};

const dots: Record<BadgeVariant, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
  default: "bg-gray-500",
};

export default function Badge({
  variant = "default",
  dot = false,
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border p-1 text-sm font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn("h-2 w-2 rounded-full", dots[variant])} />}
      {children}
    </div>
  );
}
