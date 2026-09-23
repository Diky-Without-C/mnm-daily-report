import type { InputHTMLAttributes } from "react";
import { cn } from "@utils/cn";

type RadioBoxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function RadioBox({ className, ...props }: RadioBoxProps) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-2", className)}>
      <input {...props} type="radio" className="peer sr-only" />
      <span className="flex size-5 items-center justify-center rounded-full border border-gray-300 bg-white peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/30">
        <span className="size-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
      </span>
    </label>
  );
}
