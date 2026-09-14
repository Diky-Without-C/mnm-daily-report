import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "@components/Button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@components/Dropdown";

interface ActionProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function Action({ onEdit, onDelete }: ActionProps) {
  const actionItems = [
    {
      label: "Edit",
      onClick: onEdit,
      icon: <PencilIcon className="size-4" />,
    },
    {
      label: "Delete",
      onClick: onDelete,
      icon: <TrashIcon className="size-4" />,
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="transparent" className="px-3 py-1.5">
          <EllipsisVerticalIcon className="size-5" />
        </Button>
      </DropdownTrigger>

      <DropdownContent className="p-1.5">
        {actionItems.map((item, index) => {
          return (
            <DropdownItem
              key={index}
              onClick={item.onClick}
              className="flex items-center gap-2"
            >
              {item.icon}
              <span>{item.label}</span>
            </DropdownItem>
          );
        })}
      </DropdownContent>
    </Dropdown>
  );
}
