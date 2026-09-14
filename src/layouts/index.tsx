import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useOrdersInitialization } from "@hooks/useOrderInitialization";
import { useOnlineStatus } from "@hooks/useOnlineStatus";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [expanded, setExpanded] = useState(false);
  useOnlineStatus();
  useOrdersInitialization();

  return (
    <div className="custom-background relative h-screen w-full bg-slate-200">
      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
      />
      <section className="h-full pl-18 transition-[padding] duration-300">
        <Header />
        <Outlet />
      </section>
    </div>
  );
}
