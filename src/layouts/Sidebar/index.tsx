import {
  ChartBarIcon,
  DocumentCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import HamburgerButton from "@components/Button/HamburgerButton";
import Divider from "@components/Divider";
import Brand from "@components/Brand";
import Tooltip from "@components/Tooltip";
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
    icon: <DocumentCheckIcon className="size-6" />,
    path: "/order",
  },
  {
    label: "Stuffing",
    icon: <TruckIcon className="size-6" />,
    path: "/stuffing",
  },
  {
    label: "Sales",
    icon: <ChartBarIcon className="size-6" />,
    path: "/sales",
  },
];

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const ref = useClickOutside<HTMLDivElement>({
    enabled: expanded,
    onClickOutside: () => onToggle(false),
  });

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed inset-y-0 left-0 z-10 flex flex-col border-r border-gray-800/70 bg-gray-950 shadow-[4px_0_24px_rgba(0,0,0,0.12)] transition-[width] duration-300 ease-out",
        expanded ? "w-64" : "w-18",
      )}
    >
      <header className="flex h-16 items-center px-3">
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center",
            !expanded && "justify-center",
          )}
        >
          {expanded && <Brand className="ml-2" variant="dark" />}
        </div>
        <HamburgerButton open={expanded} onToggle={onToggle} />
      </header>
      <Divider className="-mt-[2px] h-[2px] bg-gray-800/70" />
      <nav className="flex-1 px-2.5 pt-4">
        {expanded && (
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.12em] text-gray-500 uppercase">
            Workspace
          </p>
        )}

        <ul className="space-y-1">
          {menuItems.map((item) => {
            const link = (
              <NavLink
                to={item.path}
                aria-label={!expanded ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group relative flex h-11 items-center rounded-md transition-colors duration-200",
                    expanded ? "px-3" : "justify-center px-3",
                    isActive
                      ? "bg-gray-800/80 text-white shadow-sm before:absolute before:left-0 before:h-6 before:w-0.5 before:rounded-full before:bg-blue-500"
                      : "text-gray-400 hover:bg-gray-900/80 hover:text-gray-100",
                  )
                }
              >
                <span className="flex size-6 shrink-0 items-center justify-center">
                  {item.icon}
                </span>
                {expanded && (
                  <span className="ml-3 truncate text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );

            return (
              <li key={item.path}>
                {expanded ? (
                  link
                ) : (
                  <Tooltip content={item.label} position="right">
                    {link}
                  </Tooltip>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
