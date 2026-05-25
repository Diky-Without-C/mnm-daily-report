import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { formatNumber } from "@/utils/formatNumber";
import { LAST_3_MONTHS } from "../sales.constant";
import useSalesList from "../useSales";

interface SalesChartProps {
  displayedSales: ReturnType<typeof useSalesList>["displayedSales"];
}

export default function SalesChart({ displayedSales }: SalesChartProps) {
  const [seriesPositions, setSeriesPositions] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const chartSeries = useMemo(() => {
    return LAST_3_MONTHS.map((month, index) => ({
      label: month.label,
      data: displayedSales.map(({ last3MonthSales }) => last3MonthSales[index]),
      stack: "total",
    }));
  }, [displayedSales]);

  useEffect(() => {
    if (!ref.current) return;

    const calculatePositions = () => {
      if (!ref.current) return;

      const [series] = ref.current.querySelectorAll(".MuiBarChart-series");
      const elements = series?.children;

      if (!elements || elements.length === 0) return;

      const containerTop = ref.current.getBoundingClientRect().top;
      const positions: number[] = [];

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLElement;
        const rect = element.getBoundingClientRect();

        positions[i] = rect.top - containerTop - 22;
      }

      setSeriesPositions(positions);
    };

    const frame = requestAnimationFrame(() => {
      calculatePositions();
    });

    window.addEventListener("resize", calculatePositions);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", calculatePositions);
    };
  }, [displayedSales]);

  return (
    <section ref={ref} className="relative flex h-full w-full flex-col">
      <div className="pointer-events-none absolute inset-0 z-10">
        {displayedSales.map((sale, index) => (
          <span
            key={index}
            className="absolute left-2 truncate"
            style={{ top: seriesPositions[index] ?? 0 }}
          >
            {sale.total3MonthSales === 0
              ? ""
              : `${sale.item} - total ${formatNumber(sale.total3MonthSales)} ctn`}
          </span>
        ))}
      </div>
      <BarChart
        layout="horizontal"
        className="h-full w-full"
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
            data: displayedSales.map(({ item, total3MonthSales }) =>
              total3MonthSales === 0 ? " ".repeat(Number(item)) : item,
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
