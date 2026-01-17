import type { Report } from "@/app/supabase/report.dto";
import { formatNumber } from "@/utils/formatNumber";
import { DEFAULT_NUMBER_PADDING, OrderCategory } from "./order.constants";

const orderLabelMap = {
  [OrderCategory.PRE_ORDER]: (order: Report) =>
    `(PO.${order.number}/${order.from}) ${order.code} ${order.type} ${formatNumber(order.amount)}`,
  [OrderCategory.CONTAINER]: (order: Report) =>
    `(${order.from} ${order.number.toString().padStart(DEFAULT_NUMBER_PADDING, "0")}) ${order.code} ${order.type} ${formatNumber(order.amount)}`,
};

export const getOrderLabel = (order: Report) =>
  orderLabelMap[order.category](order);

export const sortOrders = (a: Report, b: Report) =>
  a.number !== b.number ? a.number - b.number : a.code.localeCompare(b.code);

export const filterOrders = (orders: Report[], search: string) =>
  orders.filter((order) =>
    getOrderLabel(order).toLowerCase().includes(search.toLowerCase()),
  );
