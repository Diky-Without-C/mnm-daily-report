import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import type { ParsedReport, ParsedSales } from "@libs/xlsx/xlsx.type";
import { ITEM_CATEGORIES } from "@constants/Items";

export type ProcessedGroup = {
  content: ParsedReport[];
  orders: OrderSchema[];
  sales?: ParsedSales[];
};

export type ProcessedGroups = Record<
  (typeof ITEM_CATEGORIES)[number],
  ProcessedGroup[]
>;
