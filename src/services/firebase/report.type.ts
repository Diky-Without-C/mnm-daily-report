import { itemTypes } from "@constant/constant.json";

export interface Report {
  category: "pre order" | "container";
  type: (typeof itemTypes)[keyof typeof itemTypes];
  amount: number;
  code: string;
  from: "MC" | "LOKAL";
  number: number;
  id: string;
}
