import { useCallback, useEffect, useState } from "react";
import { getFile, saveFile, removeFile } from "@libs/indexedDB";
import { useFileStore } from "@stores/useFileStore";

export function usePersistedFile(key: string) {
  const file = useFileStore((state) => state.files[key] ?? null);
  const setStoreFile = useFileStore((state) => state.setFile);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const saved = await getFile(key);

      if (!mounted) return;

      setStoreFile(key, saved ?? null);
      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [key, setStoreFile]);

  const setFile = useCallback(
    async (value: File | null) => {
      setStoreFile(key, value);

      if (value) {
        await saveFile(key, value);
      } else {
        await removeFile(key);
      }
    },
    [key, setStoreFile],
  );

  return [file, setFile, loading] as const;
}
