import CopyButton from "@components/buttons/CopyButton";

interface PreviewPanelProps {
  text: string;
  content: string;
  isReady: boolean;
  expanded: boolean;
}

export default function PreviewPanel({
  text,
  content,
  isReady,
  expanded,
}: PreviewPanelProps) {
  return (
    <section
      className={`relative col-start-1 col-end-3 row-end-11 rounded-xl bg-white p-4 shadow-lg ${expanded ? "row-start-6" : "row-start-3"} `}
    >
      <CopyButton text={text} disabled={!isReady} />

      <pre
        className={`h-full w-full flex-1 rounded whitespace-pre-wrap ${
          !isReady
            ? "flex items-center justify-center text-center text-gray-500"
            : "overflow-y-auto"
        }`}
      >
        {content}
      </pre>
    </section>
  );
}
