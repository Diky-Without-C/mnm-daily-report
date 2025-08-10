import { itemTypes, containerTypes } from "@constant/constant.json";

export interface Report {
  category: "pre order" | "container";
  type: (typeof itemTypes)[keyof typeof itemTypes];
  amount: number;
  code: string;
  from: (typeof containerTypes)[number];
  number: number;
  id: string;
}
