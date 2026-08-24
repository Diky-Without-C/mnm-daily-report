import { forwardRef } from "react";
import { cn } from "@utils/cn";
import { useDropdownContext } from "./DropdownContext";
import type { DropdownTriggerProps } from "./Dropdown.type";

export const DropdownTrigger = forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(function DropdownTrigger(
  { children, className, onClick, onKeyDown, ...props },
  ref,
) {
  const { open, setOpen, close, triggerId, contentId } = useDropdownContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

    setOpen(!open);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) return;

    if (event.key === "Escape" && open) {
      event.preventDefault();
      close();
      return;
    }

    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !open) {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <button
      ref={ref}
      id={triggerId}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
