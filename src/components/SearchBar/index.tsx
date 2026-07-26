import { type ChangeEvent, useRef } from "react";
import SearchIcon from "@components/Icons/Search";
import XMark from "@components/Icons/XMark";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch("");
    if (searchRef.current) {
      searchRef.current.value = "";
      searchRef.current.focus();
    }
  };

  return (
    <div className="relative flex w-full items-center">
      <input
        ref={searchRef}
        name="search"
        type="text"
        placeholder="Search"
        onChange={handleSearch}
        autoComplete="off"
        className="h-9 w-full rounded-lg border border-gray-900 bg-gray-50 pl-2 focus:border-blue-500 focus:outline-none"
      />
      <SearchIcon />
      {searchRef.current?.value && (
        <button
          onClick={handleClear}
          className="absolute right-1 mx-3 -translate-x-full cursor-pointer text-gray-800"
        >
          <XMark />
        </button>
      )}
    </div>
  );
}
