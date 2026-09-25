export const ORDER_CATEGORIES = ["pre order", "container"] as const;
export type OrderCategory = (typeof ORDER_CATEGORIES)[number];

export const CONTAINER_TYPES = ["MC", "MF", "LOKAL"] as const;
export type ContainerType = (typeof CONTAINER_TYPES)[number];

export const ORDER_TABS = ["all", ...ORDER_CATEGORIES] as const;
export type OrderTab = (typeof ORDER_TABS)[number];

export const ITEMS_PER_PAGE = 7;

export type OptionItem = {
  label: string;
  value: string;
};

export type SingleField = {
  type: "single";
  selectedValue: string | null;
  options: OptionItem[];
};

export type MultipleField = {
  type: "multiple";
  selectedValue: string[];
  options: OptionItem[];
};

export type OrderOptionField = SingleField | MultipleField;
