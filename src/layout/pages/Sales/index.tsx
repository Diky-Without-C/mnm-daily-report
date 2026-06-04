import { useState } from "react";
import SourcePanel from "./Components/SourcePanel";
import PreviewPanel from "./Components/PreviewPanel";
import useSalesPage from "./useSalesPage";
import SalesList from "@/features/MPO/components/SalesList";

export default function Sales() {
  const [showSource, setShowSource] = useState(false);
  const { file, setFile, previewText, isReady } = useSalesPage();

  return (
    <main className="grid h-[calc(100%-4rem)] grid-cols-6 grid-rows-10 gap-2 p-6">
      <SourcePanel
        file={file}
        showSource={showSource}
        onToggle={() => setShowSource((v) => !v)}
        onFileChange={(file) => {
          setFile(file);
          setShowSource(false);
        }}
      />

      <PreviewPanel
        text={previewText}
        content={previewText}
        isReady={isReady}
        expanded={showSource}
      />

      <section className="col-start-3 col-end-7 row-start-1 row-end-11 rounded-xl bg-white p-4 shadow-lg">
        <SalesList />
      </section>
    </main>
  );
}
