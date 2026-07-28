import { useMemo, useState, useCallback, useEffect } from "react";
import { useExcelParser } from "@libs/xlsx/useExcelParser";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { usePagination } from "./usePagination";
import { ITEMS_PER_PAGE, SALES_SHEET_INDEX } from "../sales.constant";
import {
  groupingSales,
  processingSales,
  createEmptySales,
} from "../sales.helper";

export default function useSalesList() {
  const [file] = usePersistedFile("mnm-xlsx-sales-storage");

  const { data: sales } = useExcelParser({
    file,
    sheetIndex: SALES_SHEET_INDEX,
    content: "sales",
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const groupedSales = useMemo(() => groupingSales(sales), [sales]);
  const categories = useMemo(() => Object.keys(groupedSales), [groupedSales]);
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
