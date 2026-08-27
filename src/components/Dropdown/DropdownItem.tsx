import { useEffect, useRef } from "react";
import { cn } from "@utils/cn";
import { useDropdownContext } from "./DropdownContext";
import type { DropdownItemProps } from "./Dropdown.type";

export function DropdownItem({
  children,
  className,
  selected = false,
  disabled = false,
  onClick,
  onMouseEnter,
  ...props
}: DropdownItemProps) {
  const {
    activeItem,
    setActiveItem,
    registerItem,
    unregisterItem,
    close,
    closeOnSelect,
  } = useDropdownContext();

  const elementRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    registerItem(element);

    return () => {
      unregisterItem(element);
    };
  }, [registerItem, unregisterItem]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

    if (closeOnSelect) {
      close();
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMouseEnter?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    setActiveItem(elementRef.current);
  };

  const isActive =
    elementRef.current !== null && activeItem === elementRef.current;

  return (
    <button
      ref={(element) => {
        elementRef.current = element;

        if (element) {
          registerItem(element);
        }
      }}
      type="button"
      role="menuitem"
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={cn(
        "flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-sm transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
        isActive && "bg-gray-100 font-medium",
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
