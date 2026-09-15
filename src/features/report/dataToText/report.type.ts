import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import type { ParsedReport, ParsedSales } from "@libs/xlsx/xlsx.type";
import { CATEGORY_KEYS } from "../report.constant";

export type ProcessedGroup = {
  content: ParsedReport[];
  orders: OrderSchema[];
  sales?: ParsedSales[];
};

export type ProcessedGroups = Record<
  (typeof CATEGORY_KEYS)[number],
  ProcessedGroup[]
>;
