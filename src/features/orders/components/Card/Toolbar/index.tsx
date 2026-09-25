import {
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Button from "@components/Button";
import SearchBar from "@components/SearchBar";
import type { MultipleField, SingleField } from "@constants/Order";
import OptionDropdown from "./OptionDropdown";

interface ToolbarProps {
  onSearch: (value: string) => void;
  onAdd: () => void;
  filter: Record<string, MultipleField>;
  onFilter: (group: string, value: MultipleField["selectedValue"]) => void;
  sort: Record<string, SingleField>;
  onSort: (group: string, value: SingleField["selectedValue"]) => void;
}

export default function Toolbar({
  onSearch,
  onAdd,
  filter,
  onFilter,
  sort,
  onSort,
}: ToolbarProps) {
  return (
    <div className="mb-2 flex">
      <div className="flex w-full gap-1">
        <SearchBar
          onSearch={onSearch}
          placeHolder="Search order"
          className="mr-0.5 w-full bg-white"
        />
        <OptionDropdown
          label={"Filter"}
          icon={<AdjustmentsHorizontalIcon className="size-5" />}
          options={filter}
          onChange={onFilter}
        />
        <OptionDropdown
          label={"Sort"}
          icon={<ArrowsUpDownIcon className="size-5" />}
          options={sort}
          onChange={onSort}
        />
        <Button
          variant="info"
          className="px-3 whitespace-nowrap"
          onClick={onAdd}
        >
          <PlusIcon className="size-5" /> Order
        </Button>
      </div>
    </div>
  );
}
