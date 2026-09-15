import { useState } from "react";
import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import OrderCard from "@features/orders/components/Card";
import StuffingCard from "@features/stuffing/component/Card";

export default function Stuffing() {
  const [selected, setSelected] = useState<OrderSchema | null>(null);

  return (
    <main className="grid h-[calc(100%-4rem)] grid-cols-3 grid-rows-1 p-3">
      <section className="relative col-start-1 col-end-2 rounded-l-md bg-white p-3">
        <StuffingCard selected={selected} />
      </section>
      <section className="relative col-start-2 col-end-4 flex items-center rounded-r-md border-l-2 border-gray-200 bg-white p-3">
        <OrderCard mode="stuffing" onSelect={setSelected} />
      </section>
    </main>
  );
}
