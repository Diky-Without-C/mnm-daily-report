import { create } from "zustand";
import type { Report } from "@apps/supabase/report.dto";

type OrdersState = {
  orders: Report[];
  setOrders: (value: Report[] | ((prev: Report[]) => Report[])) => void;
};

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],

  setOrders: (value) =>
    set((state) => ({
      orders: typeof value === "function" ? value(state.orders) : value,
    })),
}));
