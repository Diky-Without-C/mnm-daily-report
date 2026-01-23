import { useState } from "react";
import Order from "../pages/Order";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative h-screen w-full bg-slate-200">
      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
      />

      <section className="h-full pl-16 transition-[padding] duration-300">
        <Header />
        <Order />
      </section>
    </div>
  );
}
