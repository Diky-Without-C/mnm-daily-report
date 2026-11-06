import type { ProcessedSale } from "../../sales.type";

export interface ChartSegment {
  month: string;
  value: number;
  /** Width as a percentage of the longest bar (0–100). */
  widthPct: number;
}

export interface ChartRow {
  key: string;
  item: string;
  total: number;
  segments: ChartSegment[];
}

/** Pure: turns sales rows into stacked-bar rows scaled to the longest bar. */
export function buildChartRows(
  sales: ProcessedSale[],
  months: { label: string }[],
): ChartRow[] {
  const stackTotal = (sale: ProcessedSale) =>
    months.reduce(
      (sum, _, i) => sum + Math.max(sale.last3MonthSales[i] ?? 0, 0),
      0,
    );

  const longest = Math.max(0, ...sales.map(stackTotal));

  return sales.map((sale, index) => ({
    key: `${sale.item}-${index}`,
    item: sale.item,
    total: sale.total,
    segments: months.map((month, i) => {
      const value = Math.max(sale.last3MonthSales[i] ?? 0, 0);

      return {
        month: month.label,
        value,
        widthPct: longest > 0 ? (value / longest) * 100 : 0,
      };
    }),
  }));
}
