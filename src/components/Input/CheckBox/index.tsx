import type { InputHTMLAttributes } from "react";
import { cn } from "@utils/cn";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export default function Checkbox({
  id,
  label,
  checked,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-center gap-3 select-none",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          className="peer sr-only"
          {...props}
        />
        <div className="pointer-events-none absolute size-10 scale-0 rounded-full bg-blue-500/20 opacity-0 transition-all duration-300 peer-active:scale-100 peer-active:opacity-100" />
        <div className="flex size-5 items-center justify-center rounded-[4px] border-2 border-gray-400 bg-white transition-all duration-200 group-hover:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600">
          <svg
            className={cn(
              "size-3.5 text-white transition-all duration-150",
              checked ? "scale-100 opacity-100" : "scale-0 opacity-0",
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}
