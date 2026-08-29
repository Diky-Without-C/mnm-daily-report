import NotFound from "@features/orders/components/NotFound";
import SalesChart from "../SalesChart";
import Footer from "./Footer";
import Toolbar from "./Toolbar";
import { useCard } from "./useCard";

export default function SalesCard() {
  const { filter, sort, currentSales, pagination, actions } = useCard();

  return (
    <div className="flex h-full w-full flex-col">
      <Toolbar
        onSearch={actions.search}
        filter={filter}
        onFilter={actions.filter}
        sort={sort}
        onSort={actions.sort}
      />
      <div className="z-10 flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="min-h-0 flex-1">
          {!currentSales.every((sales) => sales.total === 0) ? (
            <SalesChart displayedSales={currentSales} />
          ) : (
            <NotFound />
          )}
        </div>
        <Footer pagination={pagination} />
      </div>
    </div>
  );
}
