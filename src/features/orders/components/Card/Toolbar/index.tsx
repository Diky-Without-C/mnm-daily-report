import Button from "@components/Button";
import SearchBar from "@components/SearchBar";
import Add from "@components/Icons/Add";
import ChevronUp from "@components/Icons/ChevronUp";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";
import type { OrderCategoryType } from "@features/orders/order.type";

interface ToolbarProps {
  mode: OrderCategoryType;
  onModeChange: (mode: OrderCategoryType) => void;
  onSearch: (value: string) => void;
  onAdd: () => void;
}

export default function Toolbar({
  mode,
  onModeChange,
  onSearch,
  onAdd,
}: ToolbarProps) {
  const modeOptions = [
    {
      content: "pre order",
      onClick: () => onModeChange("pre order"),
    },
    {
      content: "container",
      onClick: () => onModeChange("container"),
    },
  ];

  return (
    <div className="mb-3 flex justify-between">
      <SearchBar onSearch={onSearch} className="w-sm" />

      <div className="flex gap-1">
        <Dropdown>
          <DropdownTrigger>
            <Button className="Capitalize">
              <span>{mode}</span>
              <ChevronUp />
            </Button>
          </DropdownTrigger>
          <DropdownContent className="w-full">
            {modeOptions.map((option) => (
              <DropdownItem
                key={option.content}
                selected={option.content === mode}
                onClick={option.onClick}
              >
                {option.content}
              </DropdownItem>
            ))}
          </DropdownContent>
        </Dropdown>

        <Button className="px-3">Sort</Button>
        <Button variant="info" className="px-3" onClick={onAdd}>
          <Add />
          Order
        </Button>
      </div>
    </div>
  );
}
