import { useMemo } from "react";
import { cn } from "@utils/cn";
import { formatNumber } from "@utils/formatNumber";
import { getLast3Months } from "../../sales.utils";
import type { ProcessedSale } from "../../sales.type";
import { buildChartRows } from "./chart.utils";

interface SalesChartProps {
  displayedSales: ProcessedSale[];
}

// Oldest month → newest month, light → dark.
const SEGMENT_STYLES = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
] as const;

/**
 * Stacked horizontal bars (last 3 months per item), drawn with plain HTML/CSS.
 * Replaces the MUI chart, which needed its internal DOM to be read back to
 * position the labels and pulled in ~300 KB of libraries for one graph.
 */
export default function SalesChart({ displayedSales }: SalesChartProps) {
  const months = useMemo(() => getLast3Months(), [displayedSales]);
  const rows = useMemo(
    () => buildChartRows(displayedSales, months),
    [displayedSales, months],
  );

  return (
    <section
      aria-label="Sales over the last 3 months"
      className="flex h-full w-full flex-col gap-3"
    >
      <ul className="mt-1 flex min-h-0 flex-1 flex-col gap-2">
        {rows.map((row) =>
          row.total > 0 ? (
            <li
              key={row.key}
              className="flex min-h-0 flex-1 flex-col justify-center gap-1"
            >
              <p className="truncate text-sm font-medium text-gray-700">
                {`${row.item} - total ${formatNumber(row.total)} ctn`}
              </p>
              <div className="flex h-8 overflow-hidden bg-gray-100">
                {row.segments.map((segment, i) => (
                  <div
                    key={segment.month}
                    className={cn(
                      SEGMENT_STYLES[i],
                      "flex items-center justify-center truncate text-sm text-black/80",
                    )}
                    style={{ width: `${segment.widthPct}%` }}
                    title={`${segment.month}: ${formatNumber(segment.value)} ctn`}
                  >
                    {formatNumber(segment.value)}
                  </div>
                ))}
              </div>
              <span className="sr-only">
                {row.segments
                  .map((s) => `${s.month}: ${formatNumber(s.value)} ctn`)
                  .join(", ")}
              </span>
            </li>
          ) : (
            // Keeps the row height so the layout doesn't jump between pages.
            <li key={row.key} aria-hidden="true" className="flex-1" />
          ),
        )}
      </ul>

      <ul
        aria-label="Legend"
        className="mb-1 flex shrink-0 flex-wrap items-center justify-center gap-4 text-xs text-gray-600"
      >
        {months.map((month, i) => (
          <li key={month.label} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn("size-2.5 rounded-full", SEGMENT_STYLES[i])}
            />
            {month.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
