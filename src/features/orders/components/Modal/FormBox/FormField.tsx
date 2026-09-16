interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}

export default function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="text-sm text-gray-600">
          {label}
        </label>
      ) : (
        <span className="text-sm text-gray-600">{label}</span>
      )}
      {children}
      <span className="h-1 text-xs text-red-500">{error}</span>
    </div>
  );
}
