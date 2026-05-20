import { useEffect, useMemo, useState } from "react";
import InputField from "@components/Input/inputField";
import InputDate from "@components/Input/inputDate";
import CopyButton from "@components/buttons/CopyButton";
import ChevronUpDown from "@components/icon/ChevronUpDown";
import { useExcelParser } from "@/lib/xlsx/useExcelParser";
import { processData } from "@/features/report";
import { dataToText } from "@/features/report/helper/dataToText";
import OrderList from "@/features/orders/components/OrderList";
import type { Report } from "@/app/supabase/report.dto";
import { useSupabaseQuery } from "@/app/supabase/useSupabaseQuery";
import { useDateStore } from "@/store/usetDate.store";
import { useOrdersStore } from "@/store/useOrders.store";
import { formatDate } from "@/utils/formatDate";
import { useLocalStorage } from "@/hooks/useLocaleStorage";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [showSource, setShowSource] = useState(true);

  const { date, setDate } = useDateStore();
  const { orders, setOrders } = useOrdersStore();

  const today = date.getDate();
  const { data: xlsx, loading, error } = useExcelParser(file, today, "report");
  const { data: report } = useSupabaseQuery<Report>("report");

  const [, setCodeHint] = useLocalStorage<string[]>("codeHint", []);

  const currentDate = formatDate(date);

  useEffect(() => {
    if (!report) return;

    setOrders(report);
  }, [report, setOrders]);

  useEffect(() => {
    if (!xlsx || !xlsx.length) return;

    const codes = [...new Set(xlsx.map((sheet) => sheet.code))];
    setCodeHint(codes);
  }, [xlsx, setCodeHint]);

  const text = useMemo(() => {
    if (!xlsx) return "";

    const cleanData = processData(xlsx);
    return dataToText(cleanData, currentDate, orders);
  }, [xlsx, currentDate, orders]);

  const isReady = file && !loading && !error;

  function getContent() {
    if (!file) return "Upload an Excel file to generate today's report";
    if (loading) return "loading ...";
    if (error) return error;
    return text;
  }

  const sourceRow = showSource ? "row-end-6" : "row-end-3";
  const previewRow = showSource ? "row-start-6" : "row-start-3";

  return (
    <main className="relative grid h-[calc(100%-4rem)] w-full grid-cols-6 grid-rows-10 gap-2 p-6">
      <section
        className={`${sourceRow} relative col-start-1 col-end-3 row-start-1 flex w-full`}
      >
        <div
          className={`flex w-full flex-col rounded-xl bg-white shadow ${
            showSource ? "px-4 pt-3 pb-6" : "px-4 pt-4"
          }`}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Report Source</h1>

            {showSource && <InputDate onDateChange={setDate} date={date} />}
          </div>

          <div className={`mt-3 ${showSource ? "flex-1" : ""}`}>
            {showSource && (
              <section className="h-full">
                <InputField
                  onFileChange={(f) => {
                    setFile(f);
                    setShowSource(false);
                  }}
                />
              </section>
            )}
          </div>

          {!showSource && file && (
            <div className="mt-2 truncate text-sm text-gray-600">
              {file.name}
            </div>
          )}
        </div>

        <ChevronUpDown
          onClick={() => file && setShowSource((prev) => !prev)}
          className="absolute right-0 bottom-0 size-6 cursor-pointer text-gray-700 hover:scale-110"
        />
      </section>

      <section
        className={`${previewRow} relative col-start-1 col-end-3 row-end-11 flex h-full w-full flex-col rounded-xl bg-white p-4 shadow-lg`}
      >
        <CopyButton text={text} disabled={!isReady} />

        <pre
          className={`flex-1 rounded whitespace-pre-wrap ${
            !isReady
              ? "flex items-center justify-center text-center text-gray-500"
              : "overflow-y-auto"
          }`}
        >
          {getContent()}
        </pre>
      </section>

      <section className="relative col-start-3 col-end-5 row-start-1 row-end-11 rounded-xl bg-white p-4 shadow-lg">
        <OrderList mode="pre order" />
      </section>

      <section className="relative col-start-5 col-end-7 row-start-1 row-end-11 rounded-xl bg-white p-4 shadow-lg">
        <OrderList mode="container" />
      </section>
    </main>
  );
}
