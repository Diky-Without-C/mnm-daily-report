import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useClickOutside } from "@hooks/useClickOutside";
import { cn } from "@utils/cn";
import { combineRefs } from "@utils/combineRefs";
import type { DropdownProps } from "./Dropdown.type";
import { DropdownContext } from "./DropdownContext";

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown(
    {
      children,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      closeOnClickOutside = true,
      closeOnSelect = true,
      ignoreSelector,
      className,
    },
    ref,
  ) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const containerRef = useRef<HTMLDivElement>(null);

    const triggerId = useId();
    const contentId = useId();

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    const close = useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    const getNavigableItems = useCallback(() => {
      if (!containerRef.current) return [];
      const selector =
        'button:not([disabled]), [role="menuitem"]:not([disabled])';
      return Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(selector),
      );
    }, []);

    const clickOutsideRef = useClickOutside<HTMLDivElement>({
      enabled: open && closeOnClickOutside,
      onClickOutside: close,
      ignoreSelector,
    });

    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          return;
        }

        if (e.key === "Tab") {
          close();
          return;
        }

        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
          return;
        }

        const items = getNavigableItems();
        if (items.length === 0) return;

        e.preventDefault();

        const activeElement = document.activeElement as HTMLElement;
        const currentIndex = items.indexOf(activeElement);

        let nextIndex: number;
        if (e.key === "ArrowDown") {
          nextIndex =
            currentIndex === -1 || currentIndex === items.length - 1
              ? 0
              : currentIndex + 1;
        } else {
          nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        }

        const nextItem = items[nextIndex];
        nextItem?.focus();
        nextItem?.scrollIntoView({ block: "nearest" });
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, close, getNavigableItems]);

    const combinedRef = useMemo(
      () => combineRefs(ref, containerRef, clickOutsideRef),
      [ref, clickOutsideRef],
    );

    const contextValue = useMemo(
      () => ({
        open,
        setOpen,
        close,
        closeOnSelect,
        triggerId,
        contentId,
      }),
      [open, setOpen, close, closeOnSelect, triggerId, contentId],
    );

    return (
      <DropdownContext.Provider value={contextValue}>
        <div
          ref={combinedRef}
          className={cn("relative inline-flex", className)}
        >
          {children}
        </div>
      </DropdownContext.Provider>
    );
  },
);
