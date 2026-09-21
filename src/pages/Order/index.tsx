import OrderCard from "@features/orders/components/Card";
import PreviewPanel from "@features/report/components/PreviewPanel";
import useOrderPage from "./useOrderPage";

export default function Order() {
  const orderPage = useOrderPage();

  return (
    <main className="grid h-[calc(100%-4rem)] grid-cols-3 grid-rows-1 p-3">
      <section className="relative rounded-l-md bg-white p-3">
        <PreviewPanel {...orderPage} />
      </section>
      <section className="relative col-span-2 flex items-center rounded-r-md border-l-2 border-gray-200 bg-white p-3">
        <OrderCard />
      </section>
    </main>
  );
}
