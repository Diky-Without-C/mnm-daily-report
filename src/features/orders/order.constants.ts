import type { OrderTabs } from "./order.type";

export const ORDER_CATEGORY = {
  PRE_ORDER: "pre order",
  CONTAINER: "container",
} as const;

export const ORDER_TABS: OrderTabs[] = [
  "all",
  ...Object.values(ORDER_CATEGORY),
];

export const ITEMS_PER_PAGE = 7;
