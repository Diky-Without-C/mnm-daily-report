import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import {
  type ChangeEvent,
  type InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { formatRelativeTime } from "@utils/formatRelativeTime";
import { cn } from "@utils/cn";

interface InputFileProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: File | null;
  onChange?: (file: File | null) => void;
}

export default function InputFile({
  disabled = false,
  value = null,
  onChange,
  className,
  ...props
}: InputFileProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [lastModified, setLastModified] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setFileName(file?.name ?? "");
    setLastModified(formatRelativeTime(file?.lastModified ?? 0));
    onChange?.(file);
  };

  useEffect(() => {
    setFileName(value?.name ?? "");
    setLastModified(formatRelativeTime(value?.lastModified ?? 0));
  }, [value]);

  return (
    <div className="w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md bg-white pr-3 text-left text-sm ring-1 ring-gray-300 transition-colors focus:ring-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
          className,
        )}
      >
        <div className="pointer-events-none flex h-full w-12 shrink-0 items-center justify-center bg-gray-100">
          <CloudArrowUpIcon className="size-6 text-gray-500" />
        </div>
        <span
          className={cn(
            "truncate",
            fileName ? "text-gray-900" : "text-gray-400",
          )}
        >
          {fileName || "Choose a file"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        disabled={disabled}
        onChange={handleChange}
        {...props}
      />
      <p
        className={cn(
          "mt-1.5 text-xs text-gray-500",
          !lastModified && "opacity-0",
        )}
      >
        updated {lastModified}
      </p>
    </div>
  );
}
