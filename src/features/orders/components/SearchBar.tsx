import type { ChangeEvent } from "react";
import AddIcon from "@components/icon/Add";
import SearchIcon from "@components/icon/Search";
import type { OrderCategoryType } from "../order.type";

interface SearchBarProps {
  mode: OrderCategoryType;
  onSearch: (value: string) => void;
  onAdd: () => void;
}

export default function SearchBar({ mode, onSearch, onAdd }: SearchBarProps) {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-xl font-semibold capitalize">{mode}</h1>

      <div className="flex gap-1">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearch}
            className="h-9 rounded-lg border border-gray-900 bg-gray-50 pl-2 focus:border-blue-500 focus:outline-none"
          />
          <SearchIcon />
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg bg-blue-400 p-2 text-white hover:bg-blue-500"
        >
          <AddIcon />
        </button>
      </div>
    </div>
  );
}
