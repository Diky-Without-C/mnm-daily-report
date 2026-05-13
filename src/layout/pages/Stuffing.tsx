import OrderList from "@/features/orders/components/OrderList";
import StuffingCard from "@/features/stuffing/component/StuffingCard";
import useStuffing from "@/features/stuffing/useStuffing";

export default function Stuffing() {
  const { form, handler } = useStuffing();

  return (
    <main className="relative grid h-[calc(100%-4rem)] w-full grid-cols-6 grid-rows-10 gap-2 p-6">
      <section className="relative col-start-1 col-end-3 row-start-1 row-end-11 rounded-xl bg-white p-4 shadow-lg">
        <OrderList mode="pre order" setSelectedOrder={handler.selectItem} />
      </section>

      <section className="relative col-start-3 col-end-5 row-start-1 row-end-11 rounded-xl bg-white p-4 shadow-lg">
        <StuffingCard
          form={form}
          onChange={handler.handleChange}
          onSubmit={handler.handleSubmit}
        />
      </section>

      <section className="relative col-start-5 col-end-7 row-start-1 row-end-11 rounded-xl bg-white p-4 shadow-lg">
        <OrderList mode="container" />
      </section>
    </main>
  );
}
