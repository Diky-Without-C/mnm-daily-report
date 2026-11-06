import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Button from "@components/Button";
import Divider from "@components/Divider";
import InputFile from "@components/Input/InputFile";
import Spinner from "@components/Spinner";
import { COPY_FEEDBACK_MS, EXCEL_ACCEPT, FILE_KEYS } from "@constants/App";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { toast } from "@stores/useToast.store";
import { cn } from "@utils/cn";
import InputDate from "./InputDate";

interface PreviewPanelProps {
  setFile: (file: File | null) => void;
  date: Date;
  setDate: (date: Date) => void;
  text: string;
  content: string;
  isReady: boolean;
  loading?: boolean;
  error?: string | null;
}

export default function PreviewPanel({
  setFile,
  date,
  setDate,
  text,
  content,
  isReady,
  loading = false,
  error = null,
}: PreviewPanelProps) {
  const [isCopy, setIsCopy] = useState(false);

  const { file } = usePersistedFile(FILE_KEYS.report);

  const handleCopy = async () => {
    if (!isReady) return;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopy(true);
    } catch {
      toast.error(
        "Couldn't copy to the clipboard. Select the text and copy it manually.",
      );
    }
  };

  useEffect(() => {
    if (!isCopy) return;

    const timeout = setTimeout(() => {
      setIsCopy(false);
    }, COPY_FEEDBACK_MS);

    return () => clearTimeout(timeout);
  }, [isCopy]);

  // What the preview box shows. Errors used to be hidden behind the
  // "Import a report" hint because `isReady` is false while loading / failing.
  const hasText = !!file && !loading && !error && content.trim() !== "";
  const message = !file ? (
    <p className="text-gray-500">Import a report to preview its content.</p>
  ) : loading ? (
    <Spinner label="Reading the file" />
  ) : error ? (
    <p role="alert" className="text-red-600">
      {error}
    </p>
  ) : (
    <p className="text-gray-500">No data for this date.</p>
  );

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
                accept={EXCEL_ACCEPT}
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
              className="absolute top-2 right-2 z-10 shrink-0 p-1.5 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleCopy}
              title={isCopy ? "Copied" : "Copy report"}
              aria-label={isCopy ? "Copied" : "Copy report"}
            >
              {isCopy ? (
                <CheckIcon className="size-6" />
              ) : (
                <ClipboardIcon className="size-6" />
              )}
            </Button>
            <div
              aria-busy={loading}
              className={cn(
                "flex min-h-0 flex-1 flex-col rounded-md border border-gray-400 p-2",
                !hasText && "items-center justify-center text-center",
              )}
            >
              {hasText ? (
                <pre className="h-full w-full overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap">
                  {content}
                </pre>
              ) : (
                message
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
