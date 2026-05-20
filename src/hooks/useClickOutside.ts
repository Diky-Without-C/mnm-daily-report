import { useEffect, useRef } from "react";

interface UseClickOutsideProps {
  onClickOutside: () => void;
  enabled?: boolean;
  closeOnScroll?: boolean;
  ignoreSelector?: string;
}

export function useClickOutside<T extends HTMLElement>({
  onClickOutside,
  enabled = true,
  closeOnScroll = false,
  ignoreSelector,
}: UseClickOutsideProps) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;

      if (ignoreSelector && target.closest(ignoreSelector)) {
        return;
      }

      if (ref.current && !ref.current.contains(target)) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    if (closeOnScroll) {
      window.addEventListener("scroll", onClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      if (closeOnScroll) {
        window.removeEventListener("scroll", onClickOutside, true);
      }
    };
  }, [onClickOutside, enabled, closeOnScroll, ignoreSelector]);

  return { ref };
}
