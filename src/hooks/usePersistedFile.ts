import { useCallback, useEffect, useState } from "react";
import { getFile, removeFile, saveFile } from "@/lib/indexedDB";

export default function usePersistedFile(key: string) {
  const [file, setFileState] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const saved = await getFile(key);

        if (mounted) {
          setFileState(saved ?? null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [key]);

  const setFile = useCallback(
    async (value: File | null) => {
      setFileState(value);

      if (value) {
        await saveFile(key, value);
      } else {
        await removeFile(key);
      }
    },
    [key],
  );

  return [file, setFile, loading] satisfies readonly [
    File | null,
    (value: File | null) => Promise<void>,
    boolean,
  ];
}
