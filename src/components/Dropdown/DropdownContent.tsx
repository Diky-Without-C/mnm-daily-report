import { cn } from "@utils/cn";
import { useDropdownContext } from "./DropdownContext";
import type { DropdownContentProps } from "./Dropdown.type";

export function DropdownContent({
  children,
  className,
  onKeyDown,
  ...props
}: DropdownContentProps) {
  const { open, contentId, triggerId } = useDropdownContext();

  if (!open) return null;

  return (
    <div
      id={contentId}
      role="menu"
      aria-labelledby={triggerId}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={cn(
        "absolute top-full right-0 z-10 mt-1 flex max-h-32 min-w-36 flex-col overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-xl shadow-black/10 outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
