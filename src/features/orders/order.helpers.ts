import type { Report } from "@apps/supabase/report.dto";
import { formatNumber } from "@utils/formatNumber";
import { ORDER_CATEGORY } from "./order.constants";

const orderLabelMap = {
  [ORDER_CATEGORY.PRE_ORDER]: (order: Report) =>
    `(PO.${order.number}/${order.from}) ${order.code} ${order.type} ${formatNumber(order.amount)}`,
  [ORDER_CATEGORY.CONTAINER]: (order: Report) =>
    `(${order.from} ${order.number.toString().padStart(2, "0")}) ${order.code} ${order.type} ${formatNumber(order.amount)}`,
};

export const getOrderLabel = (order: Report) =>
  orderLabelMap[order.category](order);

export const sortOrders = (a: Report, b: Report) =>
  a.number !== b.number ? a.number - b.number : a.code.localeCompare(b.code);

export const filterOrders = (orders: Report[], search: string) =>
  orders.filter((order) =>
    getOrderLabel(order).toLowerCase().includes(search.toLowerCase()),
  );
