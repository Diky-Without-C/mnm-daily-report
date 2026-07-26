import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import HamburgerButton from "@components/Buttons/HamburgerButton";
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
        `fixed top-0 left-0 z-10 flex h-full flex-col bg-gray-800 p-2 shadow-lg transition-[width] duration-300`,
        expanded ? "w-64 overflow-x-hidden" : "w-16",
      )}
    >
      <div className={cn("flex items-center", expanded ? "w-60" : "w-12")}>
        <HamburgerButton open={expanded} onToggle={onToggle} />
      </div>
      <ul
        className={cn(
          expanded ? "w-60" : "w-12",
          "mt-8 flex flex-col gap-2 text-white",
        )}
      >
        {menuItems.map((item) => {
          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    `group relative flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-700`,
                    isActive && "bg-gray-700",
                  )
                }
              >
                {item.icon}
                {expanded ? (
                  <span className="ml-2 text-lg">{item.label}</span>
                ) : (
                  <span className="absolute left-0 ml-2 hidden translate-x-13 items-center rounded-lg bg-black px-2 py-1.5 text-white drop-shadow-lg group-hover:flex after:absolute after:left-0 after:size-2 after:-translate-x-1/2 after:rotate-45 after:bg-inherit after:content-['']">
                    {item.label}
                  </span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
