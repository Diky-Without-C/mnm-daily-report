import { type InputHTMLAttributes } from "react";
import { cn } from "@utils/cn";

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  unit?: string;
}

export default function InputText({
  unit,
  className,
  ...props
}: InputTextProps) {
  return (
    <div className="relative">
      <input
        type="text"
        autoComplete="off"
        className={cn(
          "h-10 w-full rounded-md bg-transparent px-4 text-gray-900 ring-2 ring-gray-300 focus:ring-blue-400 focus:outline-none",
          className,
        )}
        {...props}
      />
      {unit && (
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500">
          {unit}
        </span>
      )}
    </div>
  );
}
