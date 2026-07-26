import { forwardRef } from "react";
import { cn } from "@utils/cn";

interface ItemProps {
  option: string;
  isActive: boolean;
  onSelect: (value: string) => void;
}

const OptionItem = forwardRef<HTMLButtonElement, ItemProps>(
  ({ option, isActive, onSelect }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onMouseDown={() => onSelect(option)}
        className={cn(
          "block w-full px-4 py-2 text-left text-sm",
          isActive ? "bg-neutral-700" : "hover:bg-neutral-700",
        )}
      >
        {option}
      </button>
    );
  },
);

export default OptionItem;
