import { cn } from "@utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "border-gray-200 bg-gray-100 text-gray-700",
  success: "border-green-200 bg-green-100 text-green-700",
  warning: "border-yellow-200 bg-yellow-100 text-yellow-700",
  danger: "border-red-200 bg-red-100 text-red-700",
  info: "border-blue-200 bg-blue-100 text-blue-700",
};

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-1 text-sm leading-none font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
