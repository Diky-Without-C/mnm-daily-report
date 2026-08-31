import {
  ArrowUpTrayIcon,
  CheckIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "@components/Button";
import InputDate from "@components/Input/InputDate";
import { cn } from "@utils/cn";
import usePreviewPanel from "./usePreviewPanel";
import FileField from "../DialogBox/FileField";

export default function PreviewPanel() {
  const [isCopy, setIsCopy] = useState(false);
  const [showField, setShowField] = useState(false);
  const { setFile, date, setDate, text, content, isReady } = usePreviewPanel();

  const handleCopy = () => {
    if (!isReady) return;

    navigator.clipboard.writeText(text);
    setIsCopy(true);

    setTimeout(() => {
      setIsCopy(false);
    }, 500);
  };

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Stock Report</h1>
        <div className="flex gap-1">
          <Button
            className="px-3 whitespace-nowrap"
            onClick={() => setShowField(true)}
          >
            <ArrowUpTrayIcon className="size-5" /> Import Report
          </Button>
          <InputDate date={date} onDateChange={setDate} />
        </div>
      </header>
      <div className="relative mt-2 h-full w-full border-t border-gray-200">
        <Button
          variant="info"
          disabled={!isReady}
          className="absolute top-2 right-0 p-1.5"
          onClick={handleCopy}
        >
          {isCopy ? (
            <CheckIcon className="size-6" />
          ) : (
            <ClipboardIcon className="size-6" />
          )}
        </Button>
        <pre
          className={cn(
            "mt-3 h-full w-full flex-1 rounded whitespace-pre-wrap",
            !isReady
              ? "flex items-center justify-center text-center text-gray-500"
              : "overflow-y-auto",
          )}
        >
          {content}
        </pre>
      </div>
      <FileField
        open={showField}
        onCancel={() => {
          setShowField(false);
        }}
        onFileChange={setFile}
      />
    </section>
  );
}
