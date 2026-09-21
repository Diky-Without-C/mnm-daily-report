import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@components/Dropdown";
import { cn } from "@utils/cn";

export interface ActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: "default" | "danger";
}

interface ActionProps {
  items: ActionItem[];
}

export default function Action({ items }: ActionProps) {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="transparent" className="px-3 py-1.5">
          <EllipsisVerticalIcon className="size-5" />
        </Button>
      </DropdownTrigger>

      <DropdownContent className="gap-0.5 p-1.5">
        {items.map((item, index) => (
          <DropdownItem
            key={index}
            onClick={item.onClick}
            disabled={item.disabled}
            className={cn(
              "flex items-center gap-2 disabled:pointer-events-none disabled:opacity-50",
              item.variant === "danger" &&
                "border-red-200 bg-red-100 text-red-700 hover:border-red-300 hover:bg-red-200",
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}
