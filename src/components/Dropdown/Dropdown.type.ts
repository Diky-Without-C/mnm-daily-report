import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
  activeItem: HTMLButtonElement | null;
  setActiveItem: (element: HTMLButtonElement | null) => void;
  registerItem: (element: HTMLButtonElement) => void;
  unregisterItem: (element: HTMLButtonElement) => void;
  closeOnSelect: boolean;
  triggerId: string;
  contentId: string;
}

export interface DropdownProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnClickOutside?: boolean;
  closeOnScroll?: boolean;
  closeOnSelect?: boolean;
  ignoreSelector?: string;
  className?: string;
}

export interface DropdownTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
}

export interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DropdownItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
}

export type DropdownSeparatorProps = HTMLAttributes<HTMLDivElement>;
