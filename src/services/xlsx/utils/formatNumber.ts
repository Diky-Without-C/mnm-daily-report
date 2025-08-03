export default function formatNumber(value: number) {
  if (typeof value !== "number" || isNaN(value)) {
    return "";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
