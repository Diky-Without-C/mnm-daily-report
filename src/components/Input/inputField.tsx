import { useRef, useState } from "react";
import DocumentPlus from "@components/icon/documentPlus";
import DocumentText from "@components/icon/DocumentText";

interface InputFieldProps {
  onFileChange: (file: File | null) => void;
}

export default function InputField({ onFileChange }: InputFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | null) => {
    setFileName(file ? file.name : null);
    onFileChange(file);
  };

  return (
    <section
      className={[
        "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-blue-700/10 px-6 py-8 shadow-lg transition",
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
      ].join(" ")}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0] || null;
        handleFile(file);
      }}
    >
      {!fileName ? (
        <div className="flex items-center justify-center gap-2">
          <div className="mb-2 text-3xl">
            <DocumentPlus />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              Drop Excel file here or{" "}
              <span className="font-medium text-blue-600">click to browse</span>
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Accepted file: .xlsx, .xls
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <div className="mb-2 text-3xl">
            <DocumentText />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{fileName}</p>
            <p className="mt-1 text-sm text-blue-600">Click to replace file</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          handleFile(file);
        }}
      />
    </section>
  );
}
