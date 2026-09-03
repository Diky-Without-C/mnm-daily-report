import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import Modal from "@components/Modal";
import { cn } from "@utils/cn";

interface FileFieldProps {
  open: boolean;
  onCancel: () => void;
  onFileChange: (file: File | null) => void;
}

export default function FileField({
  open,
  onCancel,
  onFileChange,
}: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | null) => {
    onFileChange(file);
    onCancel();
  };

  return (
    <Modal open={open} onClose={onCancel}>
      <section
        className={cn(
          "flex min-h-72 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-10 transition-all duration-200",
          isDragging
            ? "border-blue-500 bg-blue-50/70"
            : "border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0] || null);
        }}
      >
        <div
          className={cn(
            "mb-5 flex size-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-transform duration-200",
            isDragging && "scale-110",
          )}
        >
          <DocumentPlusIcon className="size-8" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-gray-800">
            Drop your Excel file here
          </p>
          <p className="mt-1 text-sm text-gray-500">
            or{" "}
            <span className="font-medium text-blue-600">
              browse from your computer
            </span>
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Supported formats: .xlsx, .xls
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0] || null);
          }}
        />
      </section>
    </Modal>
  );
}
