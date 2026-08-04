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
        "absolute top-full right-0 z-10 mt-1 flex max-h-32 min-w-36 flex-col overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-xl shadow-black/10 outline-none",
        variant === "dark" && "border-neutral-700 bg-neutral-800 text-white",
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
              "flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none",
              variant === "dark" ? "hover:bg-neutral-700" : "hover:bg-gray-100",
              activeIndex === index &&
                (variant === "dark"
                  ? "bg-neutral-700"
                  : "bg-gray-100 font-medium"),
            )}
          >
            {option.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
