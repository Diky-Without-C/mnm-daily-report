import { useMemo, useState, useCallback, useEffect } from "react";
import { useSalesStore } from "@/store/useSales.store";
import { ITEMS_PER_PAGE, LAST_3_MONTHS } from "./sales.constant";
import { categoryToKey, paginate } from "./sales.helper";

export default function useSalesList() {
  const { sales } = useSalesStore();

  const groupedSales = useMemo(() => {
    return sales.reduce(
      (acc, sale) => {
        const key = categoryToKey(sale[0].category);
        acc[key] ??= [];
        acc[key].push(...sale);

        return acc;
      },
      {} as Record<string, (typeof sales)[number]>,
    );
  }, [sales]);

  const categories = useMemo(() => Object.keys(groupedSales), [groupedSales]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const activeCategory = selectedCategory ?? categories[0];
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const selectedSales = useMemo(() => {
    if (!activeCategory) return [];

    return groupedSales[activeCategory] ?? [];
  }, [groupedSales, activeCategory]);

  const processedSales = useMemo(() => {
    return selectedSales
      .map((item) => {
        const last3MonthSales = LAST_3_MONTHS.map(
          (month) => item.monthlySale[month.index],
        );

        return {
          ...item,
          last3MonthSales,
          total3MonthSales: last3MonthSales.reduce((a, b) => a + b, 0),
        };
      })
      .filter((item) => item.total3MonthSales > 0)
      .sort((a, b) => b.total3MonthSales - a.total3MonthSales);
  }, [selectedSales]);

  const totalPages = Math.max(
    1,
    Math.ceil(processedSales.length / ITEMS_PER_PAGE),
  );

  const displayedSales = useMemo(() => {
    const currentItems = paginate(processedSales, page, ITEMS_PER_PAGE);

    const emptyRows = Array.from({
      length: Math.max(0, ITEMS_PER_PAGE - currentItems.length),
    }).map((_, index) => ({
      item: String(index),
      last3MonthSales: LAST_3_MONTHS.map(() => 0),
      total3MonthSales: 0,
    }));

    return [...currentItems, ...emptyRows];
  }, [page, processedSales]);

  const setCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    setPage(1);
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    categories,
    displayedSales,
    pagination: {
      page,
      totalPages,
      totalItems: processedSales.length,
      isFirstPage: page === 1,
      isLastPage: page === totalPages,
    },
    selected: {
      category: activeCategory,
    },
    handlers: {
      setCategory,
      nextPage,
      prevPage,
    },
  };
}
