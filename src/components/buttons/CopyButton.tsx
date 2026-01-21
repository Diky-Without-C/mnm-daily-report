import { useState } from "react";
import Copy from "@components/icon/Copy";

interface CopyButtonProps {
  text: string;
  disabled?: boolean;
}

export default function CopyButton({
  text,
  disabled = false,
}: CopyButtonProps) {
  const [showPopup, setShowPopup] = useState(false);

  function handleCopy() {
    if (disabled) return;

    navigator.clipboard.writeText(text);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 1500);
  }

  return (
    <div className="absolute top-2 right-2">
      <button
        onClick={handleCopy}
        disabled={disabled}
        className={`flex items-center rounded-lg p-2 text-white select-none ${
          disabled
            ? "cursor-not-allowed bg-gray-300 opacity-60"
            : "cursor-pointer bg-blue-400 opacity-85 hover:bg-blue-500"
        }`}
      >
        <Copy />
      </button>

      {showPopup && (
        <div className="pointer-events-none absolute right-1/2 bottom-full z-50 w-20 translate-x-1/2 -translate-y-1 rounded-md bg-black px-2 py-1 text-center text-xs text-white opacity-90">
          Copied to clipboard
        </div>
      )}
    </div>
  );
}
