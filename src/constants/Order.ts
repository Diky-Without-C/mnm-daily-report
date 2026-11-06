export const ORDER_CATEGORIES = ["pre order", "container"] as const;
export type OrderCategory = (typeof ORDER_CATEGORIES)[number];

/** Named access to the categories above (kept in sync by `satisfies`). */
export const ORDER_CATEGORY = {
  PRE_ORDER: "pre order",
  CONTAINER: "container",
} as const satisfies Record<string, OrderCategory>;

export const CONTAINER_TYPES = ["MC", "MF", "LOKAL"] as const;
export type ContainerType = (typeof CONTAINER_TYPES)[number];

export type OrderTab = "all" | OrderCategory;
export const ORDER_TABS: OrderTab[] = ["all", ...ORDER_CATEGORIES];

export const ORDER_ITEMS_PER_PAGE = 7;
