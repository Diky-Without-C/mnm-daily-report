import {
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import SearchBar from "@components/SearchBar";
import type { MultipleField, SingleField } from "@constants/Order";
import OptionDropdown from "./OptionDropdown";

interface ToolbarProps {
  onSearch: (value: string) => void;
  filter: Record<string, MultipleField>;
  onFilter: (group: string, value: MultipleField["selectedValue"]) => void;
  sort: Record<string, SingleField>;
  onSort: (group: string, value: SingleField["selectedValue"]) => void;
  onFileChange: (file: File | null) => void;
}

export default function Toolbar({
  onSearch,
  filter,
  onFilter,
  sort,
  onSort,
  onFileChange,
}: ToolbarProps) {
  return (
    <div className="z-20 mb-2 flex">
      <div className="flex w-full gap-1">
        <SearchBar
          onSearch={onSearch}
          placeHolder="Search order"
          className="min-w-0 flex-1 bg-white"
        />
        <OptionDropdown
          label="Filter"
          icon={<AdjustmentsHorizontalIcon className="size-5" />}
          options={filter}
          onChange={onFilter}
        />
        <OptionDropdown
          label="Sort"
          icon={<ArrowsUpDownIcon className="size-5" />}
          options={sort}
          onChange={onSort}
        />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-200">
          <CloudArrowUpIcon className="size-5" />
          Import
          <input
            type="file"
            className="sr-only"
            accept=".xlsx,.xls"
            onChange={(e) => {
              onFileChange(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}
