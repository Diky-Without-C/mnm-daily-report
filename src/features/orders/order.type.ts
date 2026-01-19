import { ORDER_CATEGORY } from "./order.constants";

export type OrderCategoryLabel = keyof typeof ORDER_CATEGORY;
export type OrderCategoryType = (typeof ORDER_CATEGORY)[OrderCategoryLabel];
