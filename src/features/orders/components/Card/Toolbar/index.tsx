import { useState } from "react";
import Button from "@components/Button";
import SearchBar from "@components/SearchBar";
import DropdownMenu from "@components/Dropdown";
import Add from "@components/Icons/Add";
import ChevronUp from "@components/Icons/ChevronUp";
import type { OrderCategoryType } from "../../../order.type";

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
  const [isModeOpen, setIsModeOpen] = useState(false);

  const modeOptions = [
    {
      text: "pre order",
      onClick: () => {
        onModeChange("pre order");
        setIsModeOpen(false);
      },
    },
    {
      text: "container",
      onClick: () => {
        onModeChange("container");
        setIsModeOpen(false);
      },
    },
  ];

  return (
    <div className="mb-3 flex justify-between">
      <SearchBar onSearch={onSearch} className="w-sm" />

      <div className="flex gap-1">
        <div className="relative flex">
          <Button
            id="modeMenu"
            className="px-3"
            onClick={() => setIsModeOpen((prev) => !prev)}
          >
            {mode}
            <ChevronUp className={isModeOpen ? "rotate-180" : "rotate-0"} />
          </Button>
          <DropdownMenu
            ignoreSelector="#modeMenu"
            open={isModeOpen}
            activeIndex={modeOptions.findIndex(
              (option) => option.text === mode,
            )}
            onClose={() => setIsModeOpen(false)}
            options={modeOptions}
          />
        </div>
        <Button variant="info" className="px-3" onClick={onAdd}>
          <Add />
          Order
        </Button>
      </div>
    </div>
  );
}
