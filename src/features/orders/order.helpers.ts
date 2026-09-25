import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import type { MultipleField, SingleField } from "@constants/Order";
import { formatNumber } from "@utils/formatNumber";

const orderLabelMap = {
  ["pre order"]: (order: OrderSchema) =>
    `(PO.${order.number}/${order.from}) ${order.code} ${order.type} ${formatNumber(order.amount)}`,
  ["container"]: (order: OrderSchema) =>
    `(${order.from} ${order.number.toString().padStart(2, "0")}) ${order.code} ${order.type} ${formatNumber(order.amount)}`,
};

export const getOrderLabel = (order: OrderSchema) =>
  orderLabelMap[order.category as keyof typeof orderLabelMap](order);

export const searchOrders = (orders: OrderSchema[], search: string) => {
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

export const filterOrders = (
  orders: OrderSchema[],
  filters: Record<string, MultipleField>,
) => {
  return orders.filter((order) => {
    const matchesFrom =
      filters.from.selectedValue.includes(order.from) ?? false;
    const matchesType =
      filters.type.selectedValue.includes(order.type) ?? false;

    return matchesFrom && matchesType;
  });
};

export const sortOrders = (
  orders: OrderSchema[],
  sort: Record<string, SingleField>,
): OrderSchema[] => {
  const direction = sort.direction.selectedValue === "ascending" ? 1 : -1;

  return [...orders].sort((a, b) => {
    switch (sort.field.selectedValue) {
      case "number":
        return (a.number - b.number) * direction;
      case "amount":
        return (a.amount - b.amount) * direction;
      case "type":
        return a.type.localeCompare(b.type) * direction;
      default:
        return 0;
    }
  });
};
