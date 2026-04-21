import { useDateStore } from "@/store/usetDate.store";
import { formatDate } from "@/utils/formatDate";

export default function Header() {
  const currentDate = formatDate(useDateStore((state) => state.date));

  return (
    <header className="flex h-16 w-full items-end gap-2 border-b-2 border-gray-400/30 px-6 py-3">
      <h1 className="text-3xl font-bold">Daily Report </h1>
      <span className="text-lg font-semibold">({currentDate})</span>
    </header>
  );
}
