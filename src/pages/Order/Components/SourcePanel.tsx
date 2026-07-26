import Button from "@components/Buttons";
import BarsArrowDown from "@components/Icons/BarsArrowDown";
import BarsArrowUp from "@components/Icons/BarsArrowUp";
import InputDate from "@components/Input/InputDate";
import InputField from "@components/Input/InputField";
import { cn } from "@utils/cn";

interface SourcePanelProps {
  file: File | null;
  date: Date;
  showSource: boolean;
  setDate: (date: Date) => void;
  onToggle: () => void;
  onFileChange: (file: File | null) => void;
}

export default function SourcePanel({
  file,
  date,
  showSource,
  setDate,
  onToggle,
  onFileChange,
}: SourcePanelProps) {
  return (
    <section
      className={cn(
        "col-start-1 col-end-3 row-start-1",
        showSource ? "row-end-6" : "row-end-3",
      )}
    >
      <div className="flex h-full flex-col rounded-xl bg-white p-4 shadow">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Report Source</h1>
          <div className="flex items-center gap-1">
            <Button onClick={onToggle} className="p-1.5">
              {showSource ? <BarsArrowUp /> : <BarsArrowDown />}
            </Button>
            <InputDate onDateChange={setDate} date={date} />
          </div>
        </header>
        {showSource ? (
          <div className="mt-3 flex-1">
            <InputField onFileChange={onFileChange} />
          </div>
        ) : (
          <p className="mt-2 truncate text-sm text-gray-600">
            {file?.name || "No file selected yet"}
          </p>
        )}
      </div>
    </section>
  );
}
