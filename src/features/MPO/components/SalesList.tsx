import useSalesList from "../useSales";
import SearchBar from "@/components/SearchBar";

interface SalesPageProps {
  setSelectedSales?(): void;
}

export default function SalesList({ setSelectedSales }: SalesPageProps) {
  const { sales, handlers } = useSalesList();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold capitalize">Sales</h1>
      </div>

      <div className="flex w-full gap-1">
        <SearchBar onSearch={handlers.handleSearch} />
      </div>

      <ul className="mt-2 flex h-full flex-col items-center overflow-y-auto">
        {sales.length ? (
          sales.map((sales, i) => (
            <li
              key={i}
              onClick={() => setSelectedSales?.()}
              className="relative mt-1 flex w-full items-center justify-between rounded-md bg-gray-200 px-3 py-3 hover:bg-gray-300"
            >
              <span className="pr-2"></span>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No matching items</p>
        )}
      </ul>
    </div>
  );
}
