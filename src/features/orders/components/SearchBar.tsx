import type { ChangeEvent } from "react";
import SearchIcon from "@components/icon/Search";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Search"
        onChange={handleSearch}
        className="h-9 w-full rounded-lg border border-gray-900 bg-gray-50 pl-2 focus:border-blue-500 focus:outline-none"
      />
      <SearchIcon />
    </div>
  );
}
