import ChevronLeft from "@components/icon/ChevronLeft";
import ChevronRight from "@components/icon/ChevronRight";
import SearchBar from "@components/SearchBar";
import useSalesList from "../useSales";
import { keyToLabel } from "../sales.helper";
import SalesChart from "./SalesChart";

export default function SalesList() {
  const { categories, displayedSales, selected, pagination, handlers } =
    useSalesList();

  return (
    <div className="flex h-full w-full flex-col">
      <section className="flex w-full items-center justify-between border-b-2 border-gray-200 pb-2">
        <ul className="flex h-9 w-full gap-1 overflow-x-auto">
          {categories.map((category) => {
            const isActive = selected.category === category;

            return (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => handlers.setCategory(category)}
                  className={`flex h-full items-center rounded-lg px-3 transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {keyToLabel(category)}
                </button>
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
            <button
              type="button"
              disabled={pagination.isFirstPage}
              onClick={handlers.prevPage}
              className="rounded-lg bg-gray-300 p-1.5 transition-colors hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft />
            </button>

            <span className="text-sm">
              {pagination.page} / {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={pagination.isLastPage}
              onClick={handlers.nextPage}
              className="rounded-lg bg-gray-300 p-1.5 transition-colors hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
