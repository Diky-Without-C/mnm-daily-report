import { type ChangeEvent, useRef, useState } from "react";
import SearchIcon from "@components/Icons/Search";
import XMark from "@components/Icons/XMark";
import { cn } from "@utils/cn";

interface SearchBarProps {
  onSearch: (value: string) => void;
  className?: string;
}

export default function SearchBar({ onSearch, className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

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
    <div className={cn("relative flex w-full items-center", className)}>
      <input
        ref={inputRef}
        name="search"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search"
        autoComplete="off"
        className="h-full w-full rounded-md bg-transparent py-2 pr-14 pl-2 text-gray-900 ring-2 ring-gray-300 focus:ring-blue-400 focus:outline-none"
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-8 text-gray-800"
        >
          <XMark />
        </button>
      )}

      <div className="pointer-events-none absolute right-2">
        <SearchIcon />
      </div>
    </div>
  );
}
