import { useState, useId } from "react";
import Button from "@components/Button";
import DropdownMenu from "@components/Dropdown";
import Add from "@components/Icons/Add";
import Kebab from "@components/Icons/Kebab";
import type { OrderCategoryType } from "../../order.type";
import SearchBar from "@components/SearchBar";

interface HeaderProps {
  mode: OrderCategoryType;
  onAdd: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ mode, onAdd, onSearch }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  const options = [{ text: "Select Multiple" }];

  return (
    <div>
      <div className="mb-4 flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold capitalize">{mode}</h1>
        <div className="flex gap-1">
          <Button variant="info" onClick={onAdd} className="p-1.5">
            <Add />
          </Button>
          <div className="relative">
            <Button
              id={id}
              variant="transparent"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5"
            >
              <Kebab />
            </Button>
            <DropdownMenu
              open={isOpen}
              options={options}
              onClose={() => setIsOpen(false)}
              ignoreSelector={`#${id}`}
              className="mt-2 w-48"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full border-b-2 border-gray-300 pb-4">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
}
