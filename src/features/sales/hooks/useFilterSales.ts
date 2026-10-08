import { useCallback, useEffect, useMemo, useState } from "react";
import type { ParsedSales } from "@libs/xlsx/xlsx.type";
import { filterSales, searchSales, sortSales } from "../sales.helper";
import type { MultipleField, SingleField } from "@constants/Order";

interface UseSalesFilterParams {
  sales: ParsedSales[];
}

export function useSalesFilter({ sales }: UseSalesFilterParams) {
  const [search, setSearch] = useState("");
  const [sort, setSort] =
    useState<Record<string, SingleField>>(getInitialSort());
  const [filter, setFilter] = useState<Record<string, MultipleField>>(() =>
    getInitialFilter(sales),
  );

  useEffect(() => {
    setFilter(getInitialFilter(sales));
  }, [sales]);

  const filteredSales = useMemo(() => {
    const sorted = sortSales(sales, sort);
    const filtered = filterSales(sorted, filter);

    return searchSales(filtered, search);
  }, [sales, search, filter, sort]);

  const searchSale = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const filterChange = useCallback(
    (group: string, selectedValue: MultipleField["selectedValue"]) => {
      setFilter((prev) => {
        const current = prev[group];

        if (!current) return prev;

        return {
          ...prev,
          [group]: {
            ...current,
            selectedValue,
          },
        };
      });
    },
    [],
  );

  const sortChange = useCallback(
    (group: string, selectedValue: SingleField["selectedValue"]) => {
      setSort((prev) => {
        const current = prev[group];

        if (!current) return prev;

        return {
          ...prev,
          [group]: {
            ...current,
            selectedValue,
          },
        };
      });
    },
    [],
  );

  return {
    sales: filteredSales,
    search,
    filter,
    sort,
    searchSale,
    filterChange,
    sortChange,
  };
}

function getInitialFilter(sales: ParsedSales[]): Record<string, MultipleField> {
  const packing = [
    ...new Set(
      sales
        .map((sale) => sale.packing)
        .filter((value): value is string => Boolean(value)),
    ),
  ];

  return {
    packing: {
      type: "multiple",
      selectedValue: packing,
      options: packing.map((value) => ({
        label: value,
        value,
      })),
    },
  };
}

function getInitialSort(): Record<string, SingleField> {
  const fields = ["total", "code"];
  const directions = ["ascending", "descending"];

  return {
    field: {
      type: "single",
      selectedValue: "total",
      options: fields.map((value) => ({
        label: value,
        value,
      })),
    },
    direction: {
      type: "single",
      selectedValue: "descending",
      options: directions.map((value) => ({
        label: value,
        value,
      })),
    },
  };
}
