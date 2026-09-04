import type { Report } from "@apps/supabase/report.dto";
import { formatNumber } from "@utils/formatNumber";
import { ORDER_CATEGORY } from "./order.constants";
import type { OrderFilters, OrderSort } from "./order.type";

const orderLabelMap = {
  [ORDER_CATEGORY.PRE_ORDER]: (order: Report) =>
    `(PO.${order.number}/${order.from}) ${order.code} ${order.type} ${formatNumber(order.amount)}`,

  [ORDER_CATEGORY.CONTAINER]: (order: Report) =>
    `(${order.from} ${order.number.toString().padStart(2, "0")}) ${order.code} ${order.type} ${formatNumber(order.amount)}`,
};

export const getOrderLabel = (order: Report) =>
  orderLabelMap[order.category](order);

export const searchOrders = (orders: Report[], search: string) => {
  const queries = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (!queries.length) return orders;

  return orders.filter((order) => {
    const text = [
      order.category,
      order.from,
      order.number,
      order.code,
      order.type,
      order.amount,
    ]
      .join(" ")
      .toLowerCase();

    return queries.every((query) => text.includes(query));
  });
};

export const filterOrders = (orders: Report[], filters: OrderFilters) => {
  return orders.filter((order) => {
    const matchesFrom = filters.from[order.from] ?? false;
    const matchesType = filters.type[order.type] ?? false;

    return matchesFrom && matchesType;
  });
};

export const sortOrders = (orders: Report[], sort: OrderSort): Report[] => {
  return [...orders].sort((a, b) => {
    switch (sort) {
      case "number-asc":
        return a.number - b.number;
      case "number-desc":
        return b.number - a.number;
      case "amount-asc":
        return a.amount - b.amount;
      case "amount-desc":
        return b.amount - a.amount;
      default:
        return 0;
    }
  });
};
