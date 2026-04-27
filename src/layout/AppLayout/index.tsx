import { useState } from "react";
import Order from "../pages/Order";
import Stuffing from "../pages/Stuffing";
import Header from "./Header";
import Sidebar from "./Sidebar";
export default function AppLayout() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(0);
  const content = [<Order />, <Stuffing />];

  return (
    <div className="relative h-screen w-full bg-slate-200">
      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
        active={active}
        setActive={setActive}
      />

      <section className="h-full pl-16 transition-[padding] duration-300">
        <Header />
        {content[active]}
      </section>
    </div>
  );
}
