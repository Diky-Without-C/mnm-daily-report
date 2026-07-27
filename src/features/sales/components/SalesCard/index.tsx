import ChevronLeft from "@components/Icons/ChevronLeft";
import ChevronRight from "@components/Icons/ChevronRight";
import Button from "@components/Button";
import SearchBar from "@components/SearchBar";
import useSalesList from "../../hooks/useSales";
import { keyToLabel } from "../../sales.helper";
import SalesChart from "../SalesChart";

export default function SalesCard() {
  const { categories, displayedSales, selected, pagination, handlers } =
    useSalesList();

  return (
    <div className="flex h-full w-full flex-col">
      <section className="flex w-full items-center justify-between border-b-2 border-gray-200 pb-2">
        <ul className="mr-2 flex h-9 w-full gap-1 overflow-hidden">
          {[...categories].map((category) => {
            const isActive = selected.category === category;

            return (
              <li key={category}>
                <Button
                  type="button"
                  onClick={() => handlers.setCategory(category)}
                  variant={isActive ? "info" : "default"}
                  className="flex h-full truncate px-3"
                >
                  {keyToLabel(category)}
                </Button>
              </li>
            );
          })}
        </ul>
        <SearchBar onSearch={handlers.handleSearch} />
      </section>
      <section className="flex h-full flex-col overflow-hidden p-4">
        <div className="h-full w-full overflow-y-scroll">
          <SalesChart displayedSales={displayedSales} />
        </div>
        <footer className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Total Items: {pagination.totalItems}
          </p>
          <div className="flex items-center gap-3">
            <Button
              disabled={pagination.isFirstPage}
              onClick={handlers.prevPage}
              className="p-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft />
            </Button>
            <span className="w-12 truncate text-center text-sm">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              disabled={pagination.isLastPage}
              onClick={handlers.nextPage}
              className="p-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight />
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
}
