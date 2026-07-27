import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { formatNumber } from "@utils/formatNumber";
import { LAST_3_MONTHS } from "../../sales.constant";
import type { ProcessedSale } from "../../sales.type";

interface SalesChartProps {
  displayedSales: ProcessedSale[];
}

export default function SalesChart({ displayedSales }: SalesChartProps) {
  const [seriesPositions, setSeriesPositions] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const chartSeries = useMemo(() => {
    return LAST_3_MONTHS().map((month, index) => ({
      label: month.label,
      data: displayedSales.map(({ last3MonthSales }) => last3MonthSales[index]),
      stack: "total",
    }));
  }, [displayedSales]);

  const calculatePositions = () => {
    if (!ref.current) return;
    const series = ref.current.querySelectorAll<HTMLElement>(
      ".MuiBarChart-series",
    );
    const [{ children: elements }] = series;

    series.forEach((element) => {
      element.style.transform = "translateY(12px)";
    });

    if (!elements || elements.length === 0) return;
    const positions: number[] = [...elements].map(({ attributes }) => {
      const yPosition = attributes.getNamedItem("y")?.value;

      return yPosition ? parseFloat(yPosition) - 12 : 0;
    });

    setSeriesPositions(positions);
  };

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(calculatePositions);
      });
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [displayedSales]);

  return (
    <section ref={ref} className="relative flex h-full w-full flex-col">
      <div className="pointer-events-none absolute inset-0 z-10">
        {displayedSales.map(
          (sale, index) =>
            sale.total > 0 && (
              <span
                key={index}
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
        skipAnimation
        hideLegend
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
