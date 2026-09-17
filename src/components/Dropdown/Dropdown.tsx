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
    const [activeItem, setActiveItem] = useState<HTMLButtonElement | null>(
      null,
    );

    const itemRefs = useRef(new Set<HTMLButtonElement>());

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
      setActiveItem(null);
    }, [setOpen]);

    const registerItem = useCallback((element: HTMLButtonElement) => {
      itemRefs.current.add(element);
    }, []);

    const unregisterItem = useCallback((element: HTMLButtonElement) => {
      itemRefs.current.delete(element);

      setActiveItem((current) => (current === element ? null : current));
    }, []);

    const getItems = useCallback(() => {
      return [...itemRefs.current].sort((a, b) => {
        const position = a.compareDocumentPosition(b);

        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
          return -1;
        }

        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          return 1;
        }

        return 0;
      });
    }, []);

    const focusItem = useCallback((element: HTMLButtonElement) => {
      setActiveItem(element);
      element.focus();
      element.scrollIntoView({
        block: "nearest",
      });
    }, []);

    const clickOutsideRef = useClickOutside<HTMLDivElement>({
      enabled: open && closeOnClickOutside,
      onClickOutside: close,
      ignoreSelector,
    });

    useEffect(() => {
      if (!open) setActiveItem(null);
    }, [open]);

    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          return;
        }

        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
          return;
        }

        e.preventDefault();

        const items = getItems().filter((item) => !item.disabled);
        if (items.length === 0) return;

        const currentIndex = activeItem ? items.indexOf(activeItem) : -1;
        let nextIndex: number;

        if (e.key === "ArrowUp") {
          nextIndex =
            currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
        } else {
          nextIndex =
            currentIndex === -1
              ? items.length - 1
              : (currentIndex - 1 + items.length) % items.length;
        }

        const nextItem = items[nextIndex];
        focusItem(nextItem);
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [open, activeItem, close, getItems, focusItem]);

    const combinedRef = useMemo(
      () => combineRefs(ref, clickOutsideRef),
      [clickOutsideRef, ref],
    );

    return (
      <DropdownContext.Provider
        value={{
          open,
          setOpen,
          close,
          activeItem,
          setActiveItem,
          registerItem,
          unregisterItem,
          closeOnSelect,
          triggerId,
          contentId,
        }}
      >
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
