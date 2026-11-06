import { create } from "zustand";
import { TOAST_DURATION_MS } from "@constants/App";

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: number;
  variant: ToastVariant;
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  push: (variant: ToastVariant, message: string) => void;
  dismiss: (id: number) => void;
}

const MAX_TOASTS = 4;
let nextId = 1;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  push: (variant, message) => {
    const last = get().toasts.at(-1);

    // Don't stack the same message over and over (e.g. a failing retry loop).
    if (last && last.variant === variant && last.message === message) return;

    const id = nextId++;

    set((state) => ({
      toasts: [...state.toasts.slice(-(MAX_TOASTS - 1)), { id, variant, message }],
    }));

    setTimeout(() => get().dismiss(id), TOAST_DURATION_MS[variant]);
  },

  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/** Usable anywhere, also outside React: `toast.error("Something failed")`. */
export const toast = {
  success: (message: string) => useToastStore.getState().push("success", message),
  error: (message: string) => useToastStore.getState().push("error", message),
  info: (message: string) => useToastStore.getState().push("info", message),
};
