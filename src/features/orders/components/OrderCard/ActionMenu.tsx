import { useState } from "react";
import Kebab from "@components/Icons/Kebab";
import DropdownMenu from "@components/Dropdown";
import Button from "@components/Button";

interface OrderActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function OrderActionMenu({
  onEdit,
  onDelete,
}: OrderActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuList = [
    {
      text: "Edit",
      onClick: onEdit,
    },
    {
      text: "Delete",
      onClick: onDelete,
    },
  ];

  return (
    <div data-ignore-click-outside className="relative">
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        variant="transparent"
        className="p-1"
      >
        <Kebab />
      </Button>
      <DropdownMenu
        open={isOpen}
        options={menuList}
        onClose={() => setIsOpen(false)}
        className="top-full w-24"
        closeOnScroll
      />
    </div>
  );
}
