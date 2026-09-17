import type { Ref } from "react";

export function combineRefs<T>(...refs: Ref<T>[]) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    }
  };
}
