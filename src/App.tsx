import { useEffect, useState } from "react";
import InputField from "@components/Input/inputField";
import InputDate from "@components/Input/inputDate";
import useExcelParser, { type Item } from "@services/xlsx";
import createPair from "@services/xlsx/utils/createPair";
import groupByCategory from "@services/xlsx/utils/groupByCathegory";
import splitGroup from "@services/xlsx/utils/splitGroup";
import mergeGroup from "@services/xlsx/utils/mergeGroup";
import dataToText from "@services/xlsx/utils/dataToText";
import Order from "@components/Order";
import type { Report } from "@services/firebase/report.type";
import { useFirestoreCrud } from "@services/firebase/useFirebaseStore";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [text, setText] = useState<string>("");
  const [orders, setOrders] = useState<Report[]>([]);
  const { data, loading, error } = useExcelParser(file, date.getDate());
  const { data: report } = useFirestoreCrud("report");
  const { data: hulaan } = useFirestoreCrud("hulaan") as {
    data: { text: string }[];
  };

  const currentDate = new Date(date).toLocaleDateString("en-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const preProcessedData = (data: Item[]) => {
    const clean = data.filter((item) => item.type !== "");
    const pairs = createPair(clean);
    const split = pairs.flatMap((pair) => splitGroup(pair));
    const merge = mergeGroup(split);
    const categories = groupByCategory(merge);
    return categories;
  };

  useEffect(() => {
    const cleanData = preProcessedData(data);
    console.log(cleanData);

    setText(dataToText(cleanData, currentDate, hulaan[0]?.text || ""));
  }, [data, file, date]);

  useEffect(() => {
    setOrders(report as Report[]);
  }, [file, orders, report]);

  return (
    <main className="relative grid h-screen w-full grid-cols-6 [grid-template-rows:1fr_2fr_2fr_2fr_2fr_2fr] gap-2 bg-gray-200 p-6">
      <header className="col-start-1 col-end-5 row-start-1 row-end-2 mb-4 flex w-full items-end gap-2">
        <h1 className="text-3xl font-bold">Daily Report </h1>
        <span className="text-lg font-semibold">({currentDate})</span>
      </header>

      <div className="relative col-start-1 col-end-3 row-start-2 row-end-3 flex h-full w-full gap-2">
        <InputField onFileChange={setFile} />
        <InputDate onDateChange={setDate} />
      </div>

      <div className="relative col-start-1 col-end-3 row-start-3 row-end-7 flex h-full w-full flex-col rounded-xl bg-white p-4 shadow-lg">
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
          }}
          className="absolute top-2 right-2 flex cursor-pointer items-center rounded-lg bg-gray-200 p-2 text-gray-900 opacity-85 select-none hover:bg-gray-300 hover:text-black focus:bg-blue-600 focus:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>
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
        <h1 className="mb-4 text-center font-mono text-xl font-semibold">
          Stock di Hulaan
        </h1>
        <pre className="overflow-y-auto rounded whitespace-pre-wrap">
          {hulaan[0]?.text || ""}
        </pre>
      </section>
      <section className="relative col-start-5 col-end-7 row-start-1 row-end-7 flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-lg">
        <div className="h-1/2 w-full overflow-y-scroll rounded bg-gray-200 p-2">
          <Order
            orders={orders.filter((order) => order.category === "pre order")}
          ></Order>
        </div>
        <div className="h-1/2 w-full overflow-y-scroll rounded bg-gray-200 p-2">
          <Order
            orders={orders.filter((order) => order.category === "container")}
          ></Order>
        </div>
      </section>
    </main>
  );
}
