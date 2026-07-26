import { openDB } from "idb";

const db = openDB("mnm-xlsx-storage", 1, {
  upgrade(database) {
    if (!database.objectStoreNames.contains("files")) {
      database.createObjectStore("files");
    }
  },
});

export const saveFile = async (key: string, file: File) => {
  const database = await db;
  await database.put("files", file, key);
};

export const getFile = async (key: string) => {
  const database = await db;
  return (await database.get("files", key)) as File | undefined;
};

export const removeFile = async (key: string) => {
  const database = await db;
  await database.delete("files", key);
};
