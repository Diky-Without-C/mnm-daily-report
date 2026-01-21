import { useEffect, useState } from "react";
import InputField from "@components/Input/inputField";
import InputDate from "@components/Input/inputDate";
import Copy from "@components/icon/copy";
import { useExcelParser } from "@/lib/xlsx/useExcelParser";
import type { ParsedItem } from "@/lib/xlsx/xlsx.type";
import { createPair } from "@/features/report/helper/createPair";
import { groupByCategory } from "@/features/report/helper/groupByCathegory";
import { splitGroup } from "@/features/report/helper/splitGroup";
import { mergeGroup } from "@/features/report/helper/mergeGroup";
import { dataToText } from "@/features/report/helper/dataToText";
import Order from "@/features/orders/components/OrderPage";
import type { Report } from "@/app/supabase/report.dto";
import { useSupabaseQuery } from "@/app/supabase/useSupabaseQuery";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [text, setText] = useState<string>("");

  const { data, loading, error } = useExcelParser(file, date.getDate());
  const { data: report } = useSupabaseQuery<Report>("report");
  const { data: hulaan } = useSupabaseQuery<{ text: string; id: string }>(
    "hulaan",
  );

  const currentDate = new Date(date).toLocaleDateString("en-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const preProcessedData = (data: ParsedItem[]) => {
    const clean = data.filter((item) => item.type !== "");
    const pairs = createPair(clean);
    const split = pairs.flatMap((pair) => splitGroup(pair));
    const merge = mergeGroup(split);
    const categories = groupByCategory(merge);
    return categories;
  };

  useEffect(() => {
    const cleanData = preProcessedData(data);

    setText(dataToText(cleanData, currentDate, report as Report[]));
  }, [data, file, date, currentDate, hulaan, report]);

  return (
    <main className="relative grid h-screen w-full grid-cols-6 grid-rows-[1fr_2fr_2fr_2fr_2fr_2fr] gap-2 bg-slate-200 p-6">
      <header className="col-start-1 col-end-5 row-start-1 row-end-2 mb-4 flex w-full items-end gap-2">
        <h1 className="text-3xl font-bold">Daily Report </h1>
        <span className="text-lg font-semibold">({currentDate})</span>
      </header>

      <div className="relative col-start-1 col-end-3 row-start-2 row-end-3 flex h-full w-full">
        <div className="flex h-full w-full flex-col rounded-lg bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Report Source</h1>
            <InputDate onDateChange={setDate} />
          </div>
          <InputField onFileChange={setFile} />
        </div>
      </div>

      <div className="relative col-start-1 col-end-3 row-start-3 row-end-7 flex h-full w-full flex-col rounded-xl bg-white p-4 shadow-lg">
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
          }}
          className="absolute top-2 right-2 flex cursor-pointer items-center rounded-lg bg-blue-400 p-2 text-white opacity-85 select-none hover:bg-blue-500"
        >
          <Copy />
        </button>
        <pre className="overflow-y-auto rounded whitespace-pre-wrap">
          {!file
            ? "waiting file ..."
            : loading
              ? "loading ..."
              : error
                ? error
                : text}
        </pre>
      </div>

      <section className="relative col-start-3 col-end-5 row-start-2 row-end-7 flex h-full w-full flex-col rounded-xl bg-white p-4 shadow-lg">
        <Order mode="pre order" />
      </section>

      <section className="relative col-start-5 col-end-7 row-start-2 row-end-7 flex h-full w-full flex-col rounded-xl bg-white p-4 shadow-lg">
        <Order mode="container" />
      </section>
    </main>
  );
}
