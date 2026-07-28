import { useMemo, useState, useCallback, useEffect } from "react";
import { CATEGORY_KEYS } from "@features/report/report.constant";
import { useExcelParser } from "@libs/xlsx/useExcelParser";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { ITEMS_PER_PAGE } from "../sales.constant";
import {
  groupingSales,
  processingSales,
  createEmptySales,
} from "../sales.helper";
import { usePagination } from "./usePagination";

export default function useSalesList() {
  const [file] = usePersistedFile("mnm-xlsx-sales-storage");

  const { data: sales } = useExcelParser({
    file,
    sheetIndex: useMemo(() => [1, 2, 3, 4], []),
    content: "sales",
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const groupedSales = useMemo(() => groupingSales(sales), [sales]);
  const categories = useMemo(() => {
    return Object.keys(groupedSales).sort((a, b) => {
      if (a === "all") return -1;
      if (b === "all") return 1;

      const orderA = CATEGORY_KEYS.indexOf(a as (typeof CATEGORY_KEYS)[number]);
      const orderB = CATEGORY_KEYS.indexOf(b as (typeof CATEGORY_KEYS)[number]);

      return (
        (orderA === -1 ? Infinity : orderA) -
        (orderB === -1 ? Infinity : orderB)
      );
    });
  }, [groupedSales]);

  const activeCategory = useMemo(() => {
    if (categories.includes(selectedCategory)) {
      return selectedCategory;
    }

    return categories[0] ?? "";
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (activeCategory !== selectedCategory) {
      setSelectedCategory(activeCategory);
    }
  }, [activeCategory, selectedCategory]);

  const selectedSales = useMemo(
    () => groupedSales[activeCategory] ?? [],
    [groupedSales, activeCategory],
  );

  const processedSales = useMemo(() => {
    return processingSales(selectedSales).filter((item) =>
      item.item.toLowerCase().includes(search.toLowerCase()),
    );
  }, [selectedSales, search]);

  const pagination = usePagination({
    items: processedSales,
  });

  const displayedSales = useMemo(() => {
    return [
      ...pagination.displayedItems,
      ...createEmptySales(ITEMS_PER_PAGE - pagination.displayedItems.length),
    ];
  }, [pagination.displayedItems]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const setCategory = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      pagination.resetPage();
    },
    [pagination],
  );

  return {
    categories,
    displayedSales,
    pagination: {
      page: pagination.page,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      isFirstPage: pagination.isFirstPage,
      isLastPage: pagination.isLastPage,
    },
    selected: {
      category: activeCategory,
    },
    handlers: {
      handleSearch,
      setCategory,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
    },
  };
}
