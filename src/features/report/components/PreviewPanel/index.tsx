import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Button from "@components/Button";
import Divider from "@components/Divider";
import InputFile from "@components/Input/InputFile";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { cn } from "@utils/cn";
import InputDate from "./InputDate";

interface PreviewPanelProps {
  setFile: (file: File | null) => void;
  date: Date;
  setDate: (date: Date) => void;
  text: string;
  content: string;
  isReady: boolean;
}

export default function PreviewPanel({
  setFile,
  date,
  setDate,
  text,
  content,
  isReady,
}: PreviewPanelProps) {
  const [isCopy, setIsCopy] = useState(false);

  const { file } = usePersistedFile("mnm-xlsx-report-storage");

  const handleCopy = () => {
    if (!isReady) return;

    navigator.clipboard.writeText(text);
    setIsCopy(true);
  };

  useEffect(() => {
    if (!isCopy) return;

    const timeout = setTimeout(() => {
      setIsCopy(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [isCopy]);

  return (
    <section className="flex h-full w-full flex-col">
      <header className="shrink-0 px-3 py-4">
        <h1 className="text-xl font-semibold">Stock Report</h1>
        <p className="mt-1 text-sm text-gray-500">Preview generated content.</p>
      </header>
      <Divider />
      <div className="flex min-h-0 flex-1 flex-col px-3 py-4">
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <div className="grid shrink-0 grid-cols-[1fr_auto] items-start gap-2">
            <div className="min-w-0">
              <InputFile
                accept=".xlsx,.xls"
                value={file}
                onChange={setFile}
                className="w-full"
              />
            </div>
            <InputDate date={date} onDateChange={setDate} />
          </div>
          <section className="relative flex min-h-0 flex-1 flex-col">
            <Button
              variant="info"
              disabled={!isReady}
              className="absolute top-2 right-2 z-10 shrink-0 p-1.5"
              onClick={handleCopy}
              title={isCopy ? "Copied" : "Copy report"}
            >
              {isCopy ? (
                <CheckIcon className="size-6" />
              ) : (
                <ClipboardIcon className="size-6" />
              )}
            </Button>
            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col rounded-md border border-gray-400 p-2",
                !isReady && "items-center justify-center",
              )}
            >
              <pre
                className={cn(
                  "h-full w-full overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap",
                  !isReady &&
                    "flex items-center justify-center text-center text-gray-500",
                )}
              >
                {isReady ? content : "Import a report to preview its content."}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
