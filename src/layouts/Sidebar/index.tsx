import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import HamburgerButton from "@components/Button/HamburgerButton";
import ClipboardDocument from "@components/Icons/ClipboardDocument";
import Cube from "@components/Icons/Cube";
import Ranking from "@components/Icons/Ranking";
import Archive from "@components/Icons/Archive";
import { useClickOutside } from "@hooks/useClickOutside";
import { cn } from "@utils/cn";

interface SidebarProps {
  expanded: boolean;
  onToggle: (state: boolean) => void;
}

interface MenuItem {
  label: string;
  icon: ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Order",
    icon: <ClipboardDocument />,
    path: "/order",
  },
  {
    label: "Stuffing",
    icon: <Cube />,
    path: "/stuffing",
  },
  {
    label: "Sales",
    icon: <Ranking />,
    path: "/sales",
  },
  {
    label: "Archive",
    icon: <Archive />,
    path: "/archive",
  },
];

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const { ref } = useClickOutside<HTMLDivElement>({
    enabled: expanded,
    onClickOutside: () => onToggle(false),
  });

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed inset-y-0 left-0 z-10 flex flex-col bg-gray-900 px-3 shadow-xl transition-[width] duration-300",
        expanded ? "w-72" : "w-18",
      )}
    >
      <header className="mb-5 flex h-16 items-center border-b-2 border-gray-400 py-3">
        <HamburgerButton open={expanded} onToggle={onToggle} />
        <div className={cn("flex items-start gap-1", !expanded && "hidden")}>
          <h1 className="truncate text-xl text-white">Daily Report</h1>
        </div>
      </header>
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group relative flex h-12 items-center rounded-lg px-3 transition-colors",
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-200 hover:bg-gray-800",
                  )
                }
              >
                <div className="flex size-6 shrink-0 items-center justify-center">
                  {item.icon}
                </div>
                {expanded ? (
                  <span className="ml-3 truncate text-base font-medium">
                    {item.label}
                  </span>
                ) : (
                  <span className="pointer-events-none absolute left-full ml-4 hidden rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-xl group-hover:flex">
                    {item.label}
                    <span className="absolute top-1/2 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-inherit" />
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
