import { ORDER_CATEGORY } from "./order.constants";

export type OrderCategoryLabel = keyof typeof ORDER_CATEGORY;
export type OrderCategoryType = (typeof ORDER_CATEGORY)[OrderCategoryLabel];

export type OrderFilters = {
  from: Record<string, boolean>;
  type: Record<string, boolean>;
};

export type OrderSort =
  | "number-asc"
  | "number-desc"
  | "amount-asc"
  | "amount-desc";
