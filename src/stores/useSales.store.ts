import { create } from "zustand";
import type { ParsedSales } from "@libs/xlsx/xlsx.type";

type salesState = {
  sales: ParsedSales[][];
  setSales: (
    value: ParsedSales[][] | ((prev: ParsedSales[][]) => ParsedSales[][]),
  ) => void;
};

export const useSalesStore = create<salesState>((set) => ({
  sales: [],

  setSales: (value) =>
    set((state) => ({
      sales: typeof value === "function" ? value(state.sales) : value,
    })),
}));
