import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@utils/cn";
import { useDropdownContext } from "./DropdownContext";
import type { DropdownContentProps } from "./Dropdown.type";

function getBoundary(element: HTMLElement) {
  return (
    element.parentElement?.closest<HTMLElement>("[data-dropdown-boundary]") ??
    document.documentElement
  );
}

export function DropdownContent({
  children,
  className,
  onKeyDown,
  ...props
}: DropdownContentProps) {
  const { open, contentId, triggerId, triggerRef } = useDropdownContext();

  const contentRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

  useLayoutEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const content = contentRef.current;

    if (!trigger || !content) return;

    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    const boundary = getBoundary(trigger);
    const boundaryRect = boundary.getBoundingClientRect();

    const spaceBelow = boundaryRect.bottom - triggerRect.bottom;
    const spaceAbove = triggerRect.top - boundaryRect.top;

    if (spaceBelow >= contentRect.height) {
      setPlacement("bottom");
    } else if (spaceAbove >= contentRect.height) {
      setPlacement("top");
    } else {
      setPlacement(spaceAbove > spaceBelow ? "top" : "bottom");
    }
  }, [open, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="menu"
      aria-labelledby={triggerId}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={cn(
        "absolute right-0 z-10 flex min-w-36 flex-col overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-xl shadow-black/10 outline-none",
        placement === "bottom" ? "top-full mt-1" : "bottom-full mb-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
