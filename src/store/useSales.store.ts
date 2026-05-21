import { create } from "zustand";
import type { Report } from "@/app/supabase/report.dto";

type salesState = {
  sales: Report[];
  setSales: (value: Report[] | ((prev: Report[]) => Report[])) => void;
};

export const useSalesStore = create<salesState>((set) => ({
  sales: [],

  setSales: (value) =>
    set((state) => ({
      sales: typeof value === "function" ? value(state.sales) : value,
    })),
}));
