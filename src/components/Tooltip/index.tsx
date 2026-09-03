import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@utils/cn";

type TooltipPosition = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: "after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-inherit",
  right:
    "after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-inherit",
  bottom:
    "after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-inherit",
  left: "after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-l-inherit",
};

export default function Tooltip({
  children,
  content,
  position = "top",
  delay = 150,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hide = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      <div
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 rounded-lg border-gray-800 bg-gray-800 px-2.5 py-1.5 text-sm font-medium whitespace-nowrap text-white shadow-lg transition-all duration-150",
          positionStyles[position],
          arrowStyles[position],
          visible ? "visible opacity-100" : "invisible opacity-0",
          className,
        )}
      >
        {content}
      </div>
    </div>
  );
}
