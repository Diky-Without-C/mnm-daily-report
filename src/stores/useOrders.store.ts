import { create } from "zustand";
import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";

type OrdersState = {
  orders: OrderSchema[];
  setOrders: (
    value: OrderSchema[] | ((prev: OrderSchema[]) => OrderSchema[]),
  ) => void;
};

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],

  setOrders: (value) =>
    set((state) => ({
      orders: typeof value === "function" ? value(state.orders) : value,
    })),
}));
