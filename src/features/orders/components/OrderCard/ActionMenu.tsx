import { useId, useState } from "react";
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
  const id = useId();

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
    <div className="relative">
      <Button
        id={id}
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
        className="w-24"
        ignoreSelector={`#${id}`}
        closeOnScroll
      />
    </div>
  );
}
