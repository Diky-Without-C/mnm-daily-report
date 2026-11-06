import { MONTHS_SHORT_ID } from "@constants/Date";
import { useDateStore } from "@stores/useDate.store";

/** The 3 full months before the selected date (oldest first). */
export const getLast3Months = () => {
  const currentMonth = useDateStore.getState().date.getMonth() - 1;

  return Array.from({ length: 3 }, (_, i) => {
    const monthIndex = (currentMonth - 2 + i + 12) % 12;

    return {
      label: MONTHS_SHORT_ID[monthIndex],
      index: monthIndex,
    };
  });
};
