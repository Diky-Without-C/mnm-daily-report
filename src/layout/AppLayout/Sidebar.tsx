import { useEffect, useRef, type ReactNode } from "react";
import { NavLink } from "react-router-dom";

import HamburgerButton from "@components/buttons/HamburgerButton";
import ClipboardDocument from "@components/icon/ClipboardDocument";
import Cube from "@components/icon/Cube";

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
];

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        onToggle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded, onToggle]);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 z-10 flex h-full flex-col bg-gray-800 p-2 shadow-lg transition-[width] duration-300 ${
        expanded ? "w-64 overflow-x-hidden" : "w-16"
      }`}
    >
      <div className="flex w-64 items-center">
        <HamburgerButton open={expanded} onToggle={onToggle} />
      </div>

      <ul
        className={`${
          expanded ? "w-60" : "w-12"
        } mt-8 flex flex-col gap-2 text-white`}
      >
        {menuItems.map((item) => {
          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-gray-700" : ""
                  } group relative flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-700`
                }
              >
                {item.icon}

                {expanded && <span className="ml-2 text-lg">{item.label}</span>}

                {!expanded && (
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
