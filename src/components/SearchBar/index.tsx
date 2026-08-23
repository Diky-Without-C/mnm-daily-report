import { type ChangeEvent, useEffect, useRef, useState } from "react";
import SearchIcon from "@components/Icons/Search";
import XMark from "@components/Icons/XMark";
import Button from "@components/Button";
import { cn } from "@utils/cn";

interface SearchBarProps {
  onSearch: (value: string) => void;
  className?: string;
}

export default function SearchBar({ onSearch, className }: SearchBarProps) {
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
        placeholder="Search"
        autoComplete="off"
        className="h-full w-full rounded-md bg-transparent py-2 pr-8 pl-10 text-gray-900 ring ring-gray-300 focus:ring-blue-400 focus:outline-none"
      />
      {value && (
        <Button
          onClick={handleClear}
          variant="transparent"
          className="absolute right-2 p-0"
        >
          <XMark />
        </Button>
      )}
      {value === "" && !isFocused && (
        <span className="pointer-events-none absolute right-2 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600">
          Ctrl + K
        </span>
      )}
      <div className="pointer-events-none absolute left-2">
        <SearchIcon />
      </div>
    </div>
  );
}
