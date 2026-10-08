import {
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import SearchBar from "@components/SearchBar";
import Button from "@components/Button";
import type { MultipleField, SingleField } from "@constants/Order";
import OptionDropdown from "./OptionDropdown";

interface ToolbarProps {
  onSearch: (value: string) => void;
  filter: Record<string, MultipleField>;
  onFilter: (group: string, value: MultipleField["selectedValue"]) => void;
  sort: Record<string, SingleField>;
  onSort: (group: string, value: SingleField["selectedValue"]) => void;
}

export default function Toolbar({
  onSearch,
  filter,
  onFilter,
  sort,
  onSort,
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
        <Button className="px-3 whitespace-nowrap" onClick={() => {}}>
          <ArrowUpTrayIcon className="size-5" /> Import Sales
        </Button>
      </div>
    </div>
  );
}
