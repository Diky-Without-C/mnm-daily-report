import { cn } from "@utils/cn";
import { useDropdownContext } from "./DropdownContext";
import type { DropdownItemProps } from "./Dropdown.type";

export function DropdownItem({
  children,
  className,
  selected = false,
  disabled = false,
  onClick,
  ...props
}: DropdownItemProps) {
  const { close, closeOnSelect } = useDropdownContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

    if (closeOnSelect) {
      close();
    }
  };

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-sm transition-colors duration-150 outline-none focus:bg-gray-100 focus:font-medium focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
        disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100",
        selected && "bg-gray-100 font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
