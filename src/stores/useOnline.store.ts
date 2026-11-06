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

// Specific browser messages for a failed request (Chrome, Firefox, Safari).
const NETWORK_ERROR_PATTERNS = [
  /failed to fetch/i,
  /fetch failed/i,
  /load failed/i,
  /networkerror/i,
  /network request failed/i,
  /network error/i,
];

const getErrorField = (error: unknown, field: "message" | "name") => {
  if (typeof error === "string") return field === "message" ? error : "";
  if (typeof error !== "object" || error === null) return "";

  const value = (error as Record<string, unknown>)[field];

  return typeof value === "string" ? value : "";
};

/**
 * True when `error` looks like a connectivity problem. Accepts plain objects
 * too: supabase-js reports failures as `{ message, ... }`, not always `Error`.
 */
export function isNetworkError(error: unknown) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return true;
  }

  if (getErrorField(error, "name") === "AbortError") return true;

  const message = getErrorField(error, "message");

  return NETWORK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}
