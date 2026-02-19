import { useEffect, useRef } from "react";
import HamburgerButton from "@components/buttons/HamburgerButton";

interface SidebarProps {
  expanded: boolean;
  onToggle: (state: boolean) => void;
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        onToggle?.(!expanded);
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
      className={`fixed top-0 left-0 z-10 flex h-full flex-col border-r border-slate-400 bg-slate-300 p-2 shadow transition-[width] duration-300 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      <HamburgerButton open={expanded} onToggle={onToggle} />
    </aside>
  );
}
