import type { InputHTMLAttributes } from "react";
import { cn } from "@utils/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function Checkbox({ id, className, ...props }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group relative flex size-5 cursor-pointer items-center justify-center select-none",
        className,
      )}
    >
      <input {...props} id={id} type="checkbox" className="peer sr-only" />
      <span
        aria-hidden
        className="pointer-events-none absolute size-10 scale-0 rounded-full bg-blue-500/20 opacity-0 transition-all duration-300 peer-active:scale-100 peer-active:opacity-100"
      />
      <span
        aria-hidden
        className={cn(
          "flex size-5 items-center justify-center rounded-[4px] border-2 border-gray-400 bg-white transition-colors duration-200 group-hover:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/30",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="size-3.5 text-white opacity-100 transition-all duration-150 peer-checked:scale-100"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m5 13 4 4L19 7"
          />
        </svg>
      </span>
    </label>
  );
}
