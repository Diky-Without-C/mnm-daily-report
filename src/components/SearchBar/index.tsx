import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "@components/Button";
import { cn } from "@utils/cn";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeHolder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  className,
  placeHolder = "Search",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    onSearch(value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn("relative flex min-h-10 w-full items-center", className)}
    >
      <input
        ref={inputRef}
        name="search"
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeHolder}
        autoComplete="off"
        className="h-full w-full rounded-md bg-transparent py-2 pr-8 pl-10 text-gray-900 ring ring-gray-300 focus:ring-blue-400 focus:outline-none"
      />
      {value && (
        <Button
          onClick={handleClear}
          variant="transparent"
          className="absolute right-2 p-0"
        >
          <XMarkIcon className="size-4" />
        </Button>
      )}
      {value === "" && !isFocused && (
        <kbd className="pointer-events-none absolute right-2 flex items-center justify-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600">
          <kbd>
            <svg
              className="size-3 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </kbd>
          + <kbd>K</kbd>
        </kbd>
      )}
      <div className="pointer-events-none absolute left-2">
        <MagnifyingGlassIcon className="size-6 text-gray-400" />
      </div>
    </div>
  );
}
