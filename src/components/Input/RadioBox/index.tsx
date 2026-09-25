import type { InputHTMLAttributes } from "react";
import { cn } from "@utils/cn";

type RadioBoxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function RadioBox({ id, className, ...props }: RadioBoxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group relative flex size-5 cursor-pointer items-center justify-center select-none",
        className,
      )}
    >
      <input {...props} id={id} type="radio" className="peer sr-only" />
      <span
        aria-hidden
        className="pointer-events-none absolute size-10 scale-0 rounded-full bg-blue-500/20 opacity-0 transition-all duration-300 peer-active:scale-100 peer-active:opacity-100"
      />
      <span
        aria-hidden
        className="flex size-5 items-center justify-center rounded-full border-2 border-gray-400 bg-white transition-colors duration-200 group-hover:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/30"
      >
        <span className="size-2 scale-0 rounded-full bg-white opacity-0 transition-all duration-150 group-has-[:checked]:scale-100 group-has-[:checked]:opacity-100" />
      </span>
    </label>
  );
}
