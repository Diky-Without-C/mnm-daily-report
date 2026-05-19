import { create } from "zustand";

interface OverlayState {
  active: boolean;
  showOverlay: () => void;
  hideOverlay: () => void;
}

export const useDarkOverlay = create<OverlayState>((set) => ({
  active: false,

  showOverlay() {
    set({
      active: true,
    });
  },

  hideOverlay() {
    set({
      active: false,
    });
  },
}));
