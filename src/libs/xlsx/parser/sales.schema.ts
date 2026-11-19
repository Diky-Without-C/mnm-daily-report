interface Schema {
  name: string;
  columns: {
    item: string | string[];
    packing: string | string[];
    total?: string | string[];
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
    name: "request",
    columns: {
      item: "nama barang",
      packing: "kemasan",
      request: "mpo",
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
