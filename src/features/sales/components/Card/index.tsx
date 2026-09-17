import NotFound from "@features/orders/components/NotFound";
import { SALES_TABS } from "@features/sales/sales.constant";
import Divider from "@components/Divider";
import Tabs from "@components/Tabs";
import SalesChart from "../SalesChart";
import Footer from "./Footer";
import Toolbar from "./Toolbar";
import { useCard } from "./useCard";

export default function SalesCard() {
  const { tabs, filter, sort, currentSales, pagination, actions } = useCard();

  return (
    <div className="flex h-full w-full flex-col">
      <Toolbar
        onSearch={actions.search}
        filter={filter}
        onFilter={actions.filter}
        sort={sort}
        onSort={actions.sort}
      />
      <div className="flex h-full w-full flex-col overflow-hidden">
        <Tabs
          items={SALES_TABS.map(String)}
          value={String(tabs)}
          onChange={actions.changeTab}
        />
        <div className="min-h-0 flex-1">
          {!currentSales.every((sales) => sales.total === 0) ? (
            <SalesChart displayedSales={currentSales} />
          ) : (
            <NotFound />
          )}
        </div>
        <Divider className="h-[2px]" />
        <Footer pagination={pagination} />
      </div>
    </div>
  );
}
