import { useMemo, useState, useCallback, useEffect } from "react";
import { useSalesStore } from "@/store/useSales.store";
import { ITEMS_PER_PAGE, LAST_3_MONTHS } from "./sales.constant";
import { groupingSales, paginate, processingSales } from "./sales.helper";
import { useLocalStorage } from "@/hooks/useLocaleStorage";
import type { ParsedSales } from "@/lib/xlsx/xlsx.type";

export default function useSalesList() {
  const [search, setSearch] = useState("");
  const { sales } = useSalesStore();
  const [cachedXlsx] = useLocalStorage<ParsedSales[][]>("xlsx-data-sales", []);

  const groupedSales = useMemo(() => {
    return groupingSales(sales.length > 0 ? sales : cachedXlsx);
  }, [sales, cachedXlsx]);

  const categories = useMemo(() => Object.keys(groupedSales), [groupedSales]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const activeCategory = selectedCategory ?? categories[0];
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, activeCategory]);

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
    const filteredSales = processingSales(selectedSales).filter((item) =>
      item.item.toLowerCase().includes(search.toLowerCase()),
    );
    return filteredSales;
  }, [selectedSales, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(processedSales.length / ITEMS_PER_PAGE),
  );

  const displayedSales = useMemo(() => {
    const currentItems = paginate(processedSales, page, ITEMS_PER_PAGE);

    const uniqueItems = currentItems.filter(
      (item, index, self) =>
        index === self.findIndex((sale) => sale.item === item.item),
    );

    const emptyRows = Array.from({
      length: Math.max(0, ITEMS_PER_PAGE - uniqueItems.length),
    }).map((_, index) => ({
      item: String(index),
      last3MonthSales: LAST_3_MONTHS.map(() => 0),
      total: 0,
    }));

    return [...uniqueItems, ...emptyRows];
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

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
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
      handleSearch,
      setCategory,
      nextPage,
      prevPage,
    },
  };
}
