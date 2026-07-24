import { create } from "zustand";

export type OnlineStatus = "online" | "offline" | "checking";

interface OnlineStore {
  status: OnlineStatus;
  setStatus: (status: OnlineStatus) => void;
}

export const useOnlineStore = create<OnlineStore>((set) => ({
  status: "checking",
  setStatus: (status) => set({ status }),
}));

export function setOnline() {
  useOnlineStore.getState().setStatus("online");
}

export function setOffline() {
  useOnlineStore.getState().setStatus("offline");
}

export function isNetworkError(error: unknown) {
  if (!(error instanceof Error)) return false;

  return (
    error.name === "AbortError" ||
    error.message === "Failed to fetch" ||
    error.message.includes("fetch") ||
    error.message.includes("network")
  );
}
