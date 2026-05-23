import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { formatNumber } from "@/utils/formatNumber";
import { LAST_3_MONTHS } from "../constant";
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
      data: displayedSales.map(({ monthlyValues }) => monthlyValues[index]),
      stack: "total",
    }));
  }, [displayedSales]);

  useEffect(() => {
    if (!ref.current) return;
    const [series] = ref.current.querySelectorAll(".MuiBarChart-series");

    const elements = series && series.children;
    if (!elements || elements.length === 0) return;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      const rect = element.getBoundingClientRect();
      setSeriesPositions((prev) => {
        const newPositions = [...prev];
        newPositions[i] =
          rect.top -
          (ref.current?.getBoundingClientRect().top ?? 0) +
          rect.height / 2 -
          41;
        return newPositions;
      });
    }
  }, [displayedSales]);

  return (
    <section ref={ref} className="relative flex h-full w-full flex-col">
      <div className="pointer-events-none absolute inset-0 z-10">
        {displayedSales.map((sale, index) => (
          <span
            key={sale.item}
            className="absolute left-3 truncate"
            style={{ top: seriesPositions[index] ?? 0 }}
          >
            {"isPlaceholder" in sale && sale.isPlaceholder
              ? ""
              : `${sale.item} - total ${formatNumber("total" in sale ? sale.total : 0)} ctn`}
          </span>
        ))}
      </div>
      <BarChart
        layout="horizontal"
        height={500}
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
            data: displayedSales.map(({ item }) => item),
            disableTicks: true,
            categoryGapRatio: 0.4,
          },
        ]}
        series={chartSeries}
      />
    </section>
  );
}
