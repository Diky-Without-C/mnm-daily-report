import { type HTMLAttributes } from "react";
import { cn } from "@utils/cn";
import { useClickOutside } from "@hooks/useClickOutside";

interface DropdownOption {
  text: React.ReactNode;
  onClick?: () => void;
}

export interface DropdownProps
  extends Omit<HTMLAttributes<HTMLUListElement>, "onSelect"> {
  open: boolean;
  options: DropdownOption[];
  activeIndex?: number;
  onClose: () => void;
  onSelect?: (option: DropdownOption, index: number) => void;
  closeOnClickOutside?: boolean;
  closeOnScroll?: boolean;
  variant?: "light" | "dark";
  ignoreSelector?: string;
}

export default function DropdownMenu({
  open,
  options,
  className,
  onClose,
  onSelect,
  activeIndex,
  closeOnClickOutside = true,
  closeOnScroll,
  variant = "light",
  ignoreSelector,
  ...props
}: DropdownProps) {
  const { ref } = useClickOutside<HTMLUListElement>({
    enabled: open && closeOnClickOutside,
    onClickOutside: onClose,
    closeOnScroll,
    ignoreSelector,
  });

  if (!open) return null;

  return (
    <ul
      ref={ref}
      className={cn(
        "absolute top-full right-0 z-10 flex max-h-32 w-fit min-w-32 flex-col overflow-hidden overflow-y-auto rounded-md bg-gray-100 py-1 shadow-lg drop-shadow-xl outline-none",
        variant === "dark" && "bg-neutral-800 text-white",
        className,
      )}
      {...props}
    >
      {options.map((option, index) => (
        <li key={index}>
          <button
            onClick={() => {
              onSelect?.(option, index);
              option.onClick?.();
              onClose();
            }}
            className={cn(
              "z-20 block w-full px-4 py-2 text-left text-sm hover:bg-gray-200",
              activeIndex === index &&
                (variant === "dark" ? "bg-neutral-700" : "bg-gray-200"),
              variant === "dark" && "hover:bg-neutral-700",
            )}
          >
            {option.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
