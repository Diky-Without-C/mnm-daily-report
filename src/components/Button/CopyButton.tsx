import { useState } from "react";
import Copy from "@components/Icons/Copy";
import { cn } from "@utils/cn";
import Button from ".";

interface CopyButtonProps {
  text: string;
  disabled?: boolean;
  className?: string;
}

export default function CopyButton({
  text,
  disabled = false,
  className = "",
}: CopyButtonProps) {
  const [showPopup, setShowPopup] = useState(false);

  const handleCopy = () => {
    if (disabled) return;

    navigator.clipboard.writeText(text);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 1500);
  };

  return (
    <Button
      onClick={handleCopy}
      disabled={disabled}
      variant="info"
      className={cn(
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        "p-1.5",
        className,
      )}
    >
      <Copy />
      {showPopup && (
        <div className="pointer-events-none absolute right-1/2 bottom-full z-50 w-20 translate-x-1/2 -translate-y-1 rounded-md bg-black px-2 py-1 text-center text-xs text-white opacity-90">
          Copied to clipboard
        </div>
      )}
    </Button>
  );
}
