import Brand from "@components/Brand";
import Badge from "@components/Badge";
import { useDateStore } from "@stores/usetDate.store";
import { useOnlineStore } from "@stores/useOnline.store";
import { formatDate } from "@utils/formatDate";

export default function Header() {
  const currentDate = formatDate(useDateStore((state) => state.date));
  const { status } = useOnlineStore();

  return (
    <header className="relative flex h-16 w-full items-center justify-between gap-1 border-b-2 border-gray-400 bg-slate-100/80 px-6 py-3">
      <Brand />
      <div className="flex items-center gap-3">
        <Badge
          variant={status === "online" ? "success" : "error"}
          dot
          className="px-2"
        >
          {status == "online" ? "Online" : "Offline"}
        </Badge>
        <span className="text-md font-semibold">{currentDate}</span>
      </div>
    </header>
  );
}
