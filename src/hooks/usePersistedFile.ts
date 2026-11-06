import { useCallback, useEffect, useState } from "react";
import {
  describeStorageError,
  loadFile,
  removeFile,
  saveFile,
} from "@libs/fileStorage";
import { useFileStore } from "@stores/useFileStore";
import { toast } from "@stores/useToast.store";

export function usePersistedFile(key: string) {
  const file = useFileStore((state) => state.files[key]);
  const setStoreFile = useFileStore((state) => state.setFile);

  const [loading, setLoading] = useState(file === undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file !== undefined) {
      setLoading(false);
      return;
    }

    let active = true;

    loadFile(key)
      .then((saved) => {
        if (active) setStoreFile(key, saved);
      })
      .catch((err: unknown) => {
        if (!active) return;

        // Storage unavailable (private mode, blocked, ...): the app still works,
        // there is just nothing to restore.
        console.error("Couldn't read the saved file:", err);
        setStoreFile(key, null);
        setError("Couldn't read the previously saved file.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [key, file, setStoreFile]);

  const setFile = useCallback(
    async (value: File | null) => {
      // Show the file right away; saving happens in the background.
      setStoreFile(key, value);
      setError(null);

      try {
        if (value) {
          await saveFile(key, value);
        } else {
          await removeFile(key);
        }
      } catch (err) {
        console.error("Couldn't save the file:", err);

        // The file keeps working for this session — tell the user it won't survive a reload.
        if (value) toast.error(describeStorageError(err));
      }
    },
    [key, setStoreFile],
  );

  return {
    file: file ?? null,
    setFile,
    loading,
    error,
  };
}
