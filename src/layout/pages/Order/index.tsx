import { useState } from "react";
import OrderList from "@/features/orders/components/OrderList";
import PreviewPanel from "./Components/PreviewPanel";
import SourcePanel from "./Components/SourcePanel";
import useOrderPage from "./useOrderPage";

export default function Order() {
  const [showSource, setShowSource] = useState(false);
  const { file, setFile, date, setDate, text, content, isReady } =
    useOrderPage();

  return (
    <main className="grid h-[calc(100%-4rem)] grid-cols-6 grid-rows-10 gap-2 p-6">
      <SourcePanel
        file={file}
        date={date}
        setDate={setDate}
        showSource={showSource}
        onToggle={() => setShowSource((v) => !v)}
        onFileChange={(file) => {
          setFile(file);
          setShowSource(false);
        }}
      />

      <PreviewPanel
        text={text}
        content={content}
        isReady={isReady}
        expanded={showSource}
      />

      <section className="col-start-3 col-end-5 row-span-10 rounded-xl bg-white p-4 shadow-lg">
        <OrderList mode="pre order" />
      </section>

      <section className="col-start-5 col-end-7 row-span-10 rounded-xl bg-white p-4 shadow-lg">
        <OrderList mode="container" />
      </section>
    </main>
  );
}
