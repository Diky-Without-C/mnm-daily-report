import SalesCard from "@features/sales/components/Card";
import useSalesPage from "./useSalesPage";
import PreviewPanel from "@features/report/components/PreviewPanel";

export default function Sales() {
  const salesPage = useSalesPage();

  return (
    <main
      id="main"
      className="grid h-[calc(100%-4rem)] grid-cols-1 gap-3 overflow-y-auto p-3 lg:grid-cols-3 lg:grid-rows-1 lg:gap-0 lg:overflow-visible"
    >
      <section className="relative min-h-[32rem] rounded-md bg-white p-3 lg:col-start-1 lg:col-end-2 lg:min-h-0 lg:rounded-r-none">
        <PreviewPanel {...salesPage} />
      </section>
      <section className="relative flex min-h-[32rem] items-center rounded-md border-gray-200 bg-white p-3 lg:col-start-2 lg:col-end-4 lg:min-h-0 lg:rounded-l-none lg:border-l-2">
        <SalesCard />
      </section>
    </main>
  );
}
