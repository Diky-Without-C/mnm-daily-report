export const formatNumber = (value: number) =>
  typeof value == "number" && !isNaN(value)
    ? new Intl.NumberFormat("id-ID", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    : "";
