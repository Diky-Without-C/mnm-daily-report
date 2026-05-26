interface Schema {
  name: string;
  columns: {
    item: string | string[];
    packing: string | string[];
    category: string | string[];
    total?: string | string[];
    monthStart?: string | string[];
    request?: string | string[];
  };
  transform: (
    row: unknown[],
    indexes: Record<string, number>,
  ) => {
    total: number;
    monthlySale: number[];
  };
}

export const schemas: Schema[] = [
  {
    name: "realization",
    columns: {
      item: "nama barang",
      total: "ttl",
      packing: "kemasan",
      category: "merk",
      monthStart: "bulan",
    },
    transform: (row, indexes) => ({
      total: Number(row[indexes.total]) || 0,
      monthlySale: Array.from(
        { length: 12 },
        (_, i) => Number(row[indexes.monthStart + i]) || 0,
      ),
    }),
  },

  {
    name: "request",
    columns: {
      item: "nama barang",
      packing: "packing",
      category: "merk",
      request: "mpo mei",
    },
    transform: (row, indexes) => {
      const request = Number(row[indexes.request]) || 0;
      return {
        total: request * 3,
        monthlySale: Array.from({ length: 12 }, () => request),
      };
    },
  },
];
