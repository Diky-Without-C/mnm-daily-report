import { useDateStore } from "@/store/usetDate.store";
import { formatDate } from "@/utils/formatDate";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import Badge from "@components/Badge";
import { Link } from "react-router-dom";

export default function Header() {
  const currentDate = formatDate(useDateStore((state) => state.date));
  const isOnline = useOnlineStatus();

  return (
    <header className="flex h-16 w-full items-end gap-2 border-b-2 border-gray-400 bg-slate-100/80 px-6 py-3">
      <Link to="/" className="flex cursor-pointer items-start gap-2">
        <h1 className="text-3xl font-bold">Daily Report </h1>
        <Badge variant={isOnline ? "success" : "error"} dot></Badge>
      </Link>
      <span className="text-lg font-semibold">({currentDate})</span>
    </header>
  );
}
