interface InputFieldProps {
  onFileChange: (file: File | null) => void;
}

export default function InputField({ onFileChange }: InputFieldProps) {
  return (
    <section className="relative flex w-4/5 flex-col rounded-xl bg-red-400 px-4 py-2 shadow-lg">
      <h1 className="mb-2 text-lg font-semibold text-white">
        Insert your file here
      </h1>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          onFileChange(file);
        }}
        className="mb-4 h-12 w-full cursor-pointer rounded border border-gray-300 bg-white/80 p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </section>
  );
}
