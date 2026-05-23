import { useEffect, useState, useMemo } from "react";
import InputField from "@components/Input/inputField";
import { useExcelParser } from "@/lib/xlsx/useExcelParser";
import SalesList from "@/features/MPO/components/SalesList";
import { useSalesStore } from "@/store/useSales.store";

export default function Sales() {
  const [file, setFile] = useState<File | null>(null);

  const { setSales } = useSalesStore();

  const { data: sales } = useExcelParser({
    file,
    sheetIndex: useMemo(() => [3, 2, 1, 4], []),
    content: "sales",
  });

  useEffect(() => {
    if (!file) return;

    setSales(sales);
  }, [file, sales, setSales]);

  return (
    <main className="relative grid h-[calc(100%-4rem)] w-full grid-cols-6 grid-rows-10 gap-2 p-6">
      <section
        className={`relative col-start-1 col-end-3 row-start-1 row-end-6 flex w-full`}
      >
        <div
          className={`flex w-full flex-col rounded-xl bg-white px-4 pt-3 pb-6 shadow`}
        >
          <h1 className="my-1.5 text-xl font-semibold">Sales Source</h1>

          <div className={`mt-3 flex-1`}>
            <section className="h-full">
              <InputField
                onFileChange={(f) => {
                  setFile(f);
                }}
              />
            </section>
          </div>

          {file && (
            <div className="mt-2 truncate text-sm text-gray-600">
              {file.name}
            </div>
          )}
        </div>
      </section>

      <section
        className={`relative col-start-1 col-end-3 row-start-6 row-end-11 flex h-full w-full flex-col rounded-xl bg-white p-4 shadow-lg`}
      ></section>

      <section className="relative col-start-3 col-end-7 row-start-1 row-end-11 rounded-xl bg-white p-4 shadow-lg">
        <SalesList />
      </section>
    </main>
  );
}
