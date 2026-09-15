export const ORDER_CATEGORY = ["pre order", "container"] as const;
export type OrderCategory = (typeof ORDER_CATEGORY)[number];

export const CONTAINER_TYPES = ["MC", "MF", "LOKAL"] as const;
export type ContainerType = (typeof CONTAINER_TYPES)[number];
