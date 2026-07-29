import type { ButtonHTMLAttributes } from "react";
import { cn } from "@utils/cn";

type BtnVariant = "success" | "error" | "warning" | "info" | "default";

const variants: Record<BtnVariant, string> = {
  success:
    "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:border-green-300",
  error:
    "bg-red-100 text-red-700 border-red-200 hover:bg-red-200 hover:border-red-300",
  warning:
    "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200 hover:border-yellow-300",
  info: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 hover:border-blue-300",
  default:
    "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
}

export default function Button({
  variant = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
