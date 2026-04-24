import { useState } from "react";

export function useAutocomplete(options: string[], value: string) {
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase()),
  );

  const reset = () => setActiveIndex(-1);

  return {
    show,
    setShow,
    activeIndex,
    setActiveIndex,
    filtered,
    reset,
  };
}
