import { Link } from "react-router-dom";
import Badge from "@components/Badge";
import { useDateStore } from "@stores/usetDate.store";
import { useOnlineStore } from "@stores/useOnline.store";
import { formatDate } from "@utils/formatDate";

export default function Header() {
  const currentDate = formatDate(useDateStore((state) => state.date));
  const { status } = useOnlineStore();

  return (
    <header className="relative flex h-16 w-full items-end gap-1 border-b-2 border-gray-400 bg-slate-100/80 px-6 py-3">
      <div className="flex items-start gap-1">
        <Link to="/" className="text-3xl font-bold">
          Daily Report
        </Link>
        <Badge variant={status === "online" ? "success" : "error"} dot></Badge>
      </div>
      <span className="text-lg font-semibold">({currentDate})</span>
    </header>
  );
}
