import type { Report } from "@apps/supabase/report.dto";
import type { ParsedReport, ParsedSales } from "@libs/xlsx/xlsx.type";
import { CATEGORY_KEYS } from "../report.constant";

export type ProcessedGroup = {
  content: ParsedReport[];
  orders: Report[];
  sales?: ParsedSales[];
};

export type ProcessedGroups = Record<
  (typeof CATEGORY_KEYS)[number],
  ProcessedGroup[]
>;
