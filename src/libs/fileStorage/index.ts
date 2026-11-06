import { openDB, type IDBPDatabase } from "idb";
import { FILE_DB } from "@constants/App";

/**
 * Persists uploaded Excel files in IndexedDB (a `File` is stored as-is, so
 * saving/reading is a cheap reference copy — the bytes are only read when a
 * sheet is parsed).
 */

let dbPromise: Promise<IDBPDatabase> | undefined;

// Opened lazily on first use (not at import time) and re-tried after a failure,
// instead of caching a rejected promise forever.
function getDb() {
  dbPromise ??= openDB(FILE_DB.name, FILE_DB.version, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(FILE_DB.store)) {
        database.createObjectStore(FILE_DB.store);
      }
    },
  }).catch((error) => {
    dbPromise = undefined;
    throw error;
  });

  return dbPromise;
}

let persistRequested = false;

/** Asks the browser not to evict the stored files when disk space is low. */
async function requestPersistentStorage() {
  if (persistRequested) return;
  persistRequested = true;

  try {
    await navigator.storage?.persist?.();
  } catch {
    // Best effort only.
  }
}

export async function saveFile(key: string, file: File) {
  const db = await getDb();

  await db.put(FILE_DB.store, file, key);
  void requestPersistentStorage();
}

export async function getFile(key: string) {
  const db = await getDb();

  return ((await db.get(FILE_DB.store, key)) as File | undefined) ?? null;
}

export async function removeFile(key: string) {
  const db = await getDb();

  await db.delete(FILE_DB.store, key);
}

const inflight = new Map<string, Promise<File | null>>();

/** Like `getFile`, but concurrent callers for the same key share one read. */
export function loadFile(key: string) {
  let pending = inflight.get(key);

  if (!pending) {
    pending = getFile(key).finally(() => inflight.delete(key));
    inflight.set(key, pending);
  }

  return pending;
}

/** Human-readable reason for a failed save. */
export function describeStorageError(error: unknown) {
  const name =
    typeof error === "object" && error !== null && "name" in error
      ? String((error as { name: unknown }).name)
      : "";

  return name === "QuotaExceededError"
    ? "Not enough browser storage to keep this file for next time."
    : "The browser couldn't save this file, so it will be gone after a reload.";
}
