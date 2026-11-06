import { XMarkIcon } from "@heroicons/react/24/outline";
import { useToastStore, type ToastVariant } from "@stores/useToast.store";
import { cn } from "@utils/cn";

const styles: Record<ToastVariant, string> = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

export default function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-4 right-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.variant === "error" ? "alert" : "status"}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-md border p-3 text-sm shadow-lg",
            styles[toast.variant],
          )}
        >
          <p className="flex-1">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismiss(toast.id)}
            className="shrink-0 cursor-pointer rounded p-0.5 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          >
            <XMarkIcon className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
