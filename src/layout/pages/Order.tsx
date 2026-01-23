import { useEffect, useState } from "react";
import InputField from "@components/Input/inputField";
import InputDate from "@components/Input/inputDate";
import CopyButton from "@components/buttons/CopyButton";
import ChevronUpDown from "@components/icon/ChevronUpDown";
import { useExcelParser } from "@/lib/xlsx/useExcelParser";
import type { ParsedItem } from "@/lib/xlsx/xlsx.type";
import { createPair } from "@/features/report/helper/createPair";
import { groupByCategory } from "@/features/report/helper/groupByCathegory";
import { splitGroup } from "@/features/report/helper/splitGroup";
import { mergeGroup } from "@/features/report/helper/mergeGroup";
import { dataToText } from "@/features/report/helper/dataToText";
import Order from "@/features/orders/components/Order";
import type { Report } from "@/app/supabase/report.dto";
import { useSupabaseQuery } from "@/app/supabase/useSupabaseQuery";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [text, setText] = useState<string>("");
  const [showSource, setShowSource] = useState(true);

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

  const viewState = !file
    ? "idle"
    : loading
      ? "loading"
      : error
        ? "error"
        : "ready";

  const content = {
    idle: "Upload an Excel file to generate today's report",
    loading: "loading ...",
    error: error ?? "",
    ready: text,
  };

  useEffect(() => {
    const cleanData = preProcessedData(data);

    setText(dataToText(cleanData, currentDate, report as Report[]));
  }, [data, file, date, currentDate, hulaan, report]);

  useEffect(() => {
    if (file) setShowSource(false);
  }, [file]);

  return (
    <main className="relative grid h-[calc(100%-4rem)] w-full grid-cols-6 grid-rows-10 gap-2 p-6">
      <section
        className={`${!showSource ? "row-end-3" : "row-end-6"} relative col-start-1 col-end-3 row-start-1 flex w-full`}
      >
        <div
          className={`flex w-full flex-col rounded-lg bg-white shadow ${showSource ? "px-4 pt-4 pb-6" : "px-4 py-2"} `}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Report Source</h1>

            <div className="flex items-center">
              {showSource && <InputDate onDateChange={setDate} />}
            </div>
          </div>

          <div className="mt-3">
            <section className={showSource ? "block" : "hidden"}>
              <InputField onFileChange={setFile} />
            </section>
          </div>

          {!showSource && file && (
            <div className="mt-2 truncate text-sm text-gray-600">
              {file.name}
            </div>
          )}
        </div>

        <ChevronUpDown
          onClick={() => file && setShowSource((prev) => !prev)}
          className="absolute right-0 bottom-0 size-6 -rotate-45 cursor-pointer text-gray-700 hover:scale-110"
        />
      </section>

      <section
        className={`${!showSource ? "row-start-3" : "row-start-6"} relative col-start-1 col-end-3 row-end-11 flex h-full w-full flex-col rounded-xl bg-white p-4 shadow-lg`}
      >
        <CopyButton text={text} disabled={viewState !== "ready"} />

        <pre
          className={`flex-1 rounded whitespace-pre-wrap ${
            viewState !== "ready"
              ? "flex items-center justify-center text-center text-gray-500"
              : "overflow-y-auto"
          }`}
        >
          {content[viewState]}
        </pre>
      </section>

      <section className="relative col-start-3 col-end-5 row-start-1 row-end-11 rounded-xl bg-white p-4 shadow-lg">
        <Order mode="pre order" />
      </section>

      <section className="relative col-start-5 col-end-7 row-start-1 row-end-11 bg-white p-4 shadow-lg">
        <Order mode="container" />
      </section>
    </main>
  );
}
