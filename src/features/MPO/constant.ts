export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export const ITEMS_PER_PAGE = 7;

export const LAST_3_MONTHS = Array.from({ length: 3 }, (_, i) => {
  const currentMonth = new Date().getMonth() - 1;
  const monthIndex = (currentMonth - 2 + i + 12) % 12;

  return {
    label: MONTHS[monthIndex],
    index: monthIndex,
  };
});
