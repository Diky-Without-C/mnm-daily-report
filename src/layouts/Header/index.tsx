import Brand from "@components/Brand";
import Badge from "@components/Badge";
import { useDateStore } from "@stores/useDate.store";
import { useOnlineStore } from "@stores/useOnline.store";
import { formatDate } from "@utils/formatDate";

const STATUS_BADGE = {
  online: { variant: "success", label: "Online" },
  offline: { variant: "danger", label: "Offline" },
  checking: { variant: "default", label: "Checking…" },
} as const;

export default function Header() {
  const currentDate = formatDate(useDateStore((state) => state.date));
  const status = useOnlineStore((state) => state.status);
  const { variant, label } = STATUS_BADGE[status];

  return (
    <header className="relative flex h-16 w-full items-center justify-between gap-1 border-b-2 border-gray-400 bg-slate-100/80 px-6 py-3">
      <Brand />
      <div className="flex items-center gap-3">
        <span role="status" aria-live="polite">
          <Badge variant={variant} className="px-2">
            {label}
          </Badge>
        </span>
        <span className="text-md font-semibold">{currentDate}</span>
      </div>
    </header>
  );
}
