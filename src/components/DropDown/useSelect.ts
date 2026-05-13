import { useState } from "react";

export function useSelect<T>(options: readonly T[]) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  return {
    open,
    setOpen,
    toggle,
    close,
    activeIndex,
    setActiveIndex,
    options,
  };
}
