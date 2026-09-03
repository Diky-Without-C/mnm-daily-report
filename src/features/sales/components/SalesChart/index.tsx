import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { formatNumber } from "@utils/formatNumber";
import { LAST_3_MONTHS } from "../../sales.constant";
import type { ProcessedSale } from "../../sales.type";

interface SalesChartProps {
  displayedSales: ProcessedSale[];
}

const BAR_OFFSET = 12;

export default function SalesChart({ displayedSales }: SalesChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [seriesPositions, setSeriesPositions] = useState<number[]>([]);

  const chartSeries = useMemo(
    () =>
      LAST_3_MONTHS().map((month, index) => ({
        label: month.label,
        data: displayedSales.map(
          ({ last3MonthSales }) => last3MonthSales[index],
        ),
        stack: "total",
      })),
    [displayedSales],
  );

  const getSeriesPositions = useCallback(() => {
    const container = containerRef.current;

    if (!container) return;

    const series = container.querySelector<HTMLElement>(".MuiBarChart-series");

    if (!series) return;

    const positions = [...series.children]
      .map((element) => {
        const y = element.getAttribute("y");

        return y ? Number(y) - BAR_OFFSET : null;
      })
      .filter((position): position is number => position !== null);

    if (positions.length !== displayedSales.length) return;

    setSeriesPositions(positions);
  }, [displayedSales.length]);

  useEffect(() => {
    const frame = requestAnimationFrame(getSeriesPositions);
    return () => cancelAnimationFrame(frame);
  }, [displayedSales, getSeriesPositions]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;
    const observer = new ResizeObserver(getSeriesPositions);
    observer.observe(container);

    return () => observer.disconnect();
  }, [getSeriesPositions]);

  return (
    <section
      ref={containerRef}
      className="relative flex h-full w-full flex-col"
    >
      <div className="pointer-events-none absolute inset-0 z-10">
        {displayedSales.map(
          (sale, index) =>
            sale.total > 0 &&
            seriesPositions[index] !== undefined && (
              <span
                key={sale.item}
                className="absolute left-2 truncate"
                style={{ top: seriesPositions[index] }}
              >
                {`${sale.item} - total ${formatNumber(sale.total)} ctn`}
              </span>
            ),
        )}
      </div>
      <BarChart
        layout="horizontal"
        className="h-full w-full"
        hideLegend
        sx={{
          "& .MuiBarChart-series": {
            transform: `translateY(${BAR_OFFSET}px)`,
          },
        }}
        margin={{
          top: 20,
          bottom: 20,
          left: -40,
          right: 0,
        }}
        yAxis={[
          {
            scaleType: "band",
            data: displayedSales.map(({ item, total }) =>
              total === 0 ? " ".repeat(Number(item)) : item,
            ),
            disableTicks: true,
            categoryGapRatio: 0.4,
          },
        ]}
        series={chartSeries}
      />
    </section>
  );
}
