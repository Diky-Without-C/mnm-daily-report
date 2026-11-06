import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@utils/cn";

type BtnVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "default"
  | "transparent";

const variants: Record<BtnVariant, string> = {
  success:
    "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:border-green-300",
  danger:
    "bg-red-100 text-red-700 border-red-200 hover:bg-red-200 hover:border-red-300",
  warning:
    "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200 hover:border-yellow-300",
  info: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 hover:border-blue-300",
  default:
    "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300",
  transparent: "border-none bg-transparent text-gray-900 hover:bg-gray-100",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:outline-none",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
