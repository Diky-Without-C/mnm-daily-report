import type { Report } from "@/app/supabase/report.dto";
import type { ParsedReport, ParsedSales } from "@/lib/xlsx/xlsx.type";
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
