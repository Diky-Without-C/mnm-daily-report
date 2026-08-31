import OrderCard from "@features/orders/components/Card";
import PreviewPanel from "@features/orders/components/PreviewPanel";

export default function Order() {
  return (
    <main className="grid h-[calc(100%-4rem)] grid-cols-3 grid-rows-1 p-3">
      <section className="relative col-start-1 col-end-2 rounded-l-md bg-white p-3">
        <PreviewPanel />
      </section>
      <section className="relative col-start-2 col-end-4 flex items-center rounded-r-md border-l-2 border-gray-200 bg-white p-3">
        <OrderCard />
      </section>
    </main>
  );
}
