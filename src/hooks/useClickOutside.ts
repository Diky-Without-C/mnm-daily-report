import { useEffect, useRef } from "react";

interface UseClickOutsideProps {
  onClickOutside: () => void;
  enabled?: boolean;
  ignoreSelector?: string;
}

export function useClickOutside<T extends HTMLElement>({
  onClickOutside,
  enabled = true,
  ignoreSelector,
}: UseClickOutsideProps) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      if (ignoreSelector && target.closest(ignoreSelector)) {
        return;
      }

      if (!ref.current?.contains(target)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [enabled, ignoreSelector, onClickOutside]);

  return ref;
}
