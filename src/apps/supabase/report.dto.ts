import type { ItemTypeLabel, ContainerType } from "@apps/constants";

export interface Report {
  category: "pre order" | "container";
  type: ItemTypeLabel;
  amount: number;
  code: string;
  from: ContainerType;
  number: number;
  id: string;
}
