import { useState } from "react";
import Kebab from "@components/Icons/Kebab";
import { useClickOutside } from "@hooks/useClickOutside";

interface OrderActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  position: "Top" | "Bottom";
}

export default function OrderActionMenu({
  onEdit,
  onDelete,
  position,
}: OrderActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref } = useClickOutside<HTMLDivElement>({
    enabled: isOpen,
    closeOnScroll: true,
    onClickOutside: () => setIsOpen(false),
  });

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((v) => !v);
        }}
        className="cursor-pointer rounded-md p-1 text-gray-600 hover:bg-gray-300"
      >
        <Kebab />
      </button>
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${position === "Top" ? "top-0" : "bottom-0"} absolute right-0 z-10 w-28 overflow-hidden rounded-md bg-gray-50 shadow-lg`}
        >
          <button
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
