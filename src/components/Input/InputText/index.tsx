import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@utils/cn";

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  unit?: string;
  invalid?: boolean;
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  function InputText(
    {
      unit,
      invalid = false,
      className,
      type,
      onBeforeInput,
      inputMode,
      ...props
    },
    ref,
  ) {
    const isNumber = type === "number";

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type="text"
          autoComplete="off"
          inputMode={isNumber ? "numeric" : inputMode}
          onBeforeInput={(e) => {
            if (isNumber && e.data && /\D/.test(e.data)) {
              e.preventDefault();
              return;
            }
            onBeforeInput?.(e);
          }}
          className={cn(
            "h-10 w-full rounded-md bg-transparent px-4 text-gray-900 ring-1 focus:ring-blue-400 focus:outline-none",
            invalid ? "ring-red-500" : "ring-gray-300",
            unit && "pr-10",
            className,
          )}
        />
        {unit && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500">
            {unit}
          </span>
        )}
      </div>
    );
  },
);

export default InputText;
