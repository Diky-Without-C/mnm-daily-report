import reportParser from "./parser/report.parser";
import salesParser from "./parser/sales.parser";
import type { Contents, ParserMap } from "./xlsx.type";

type Parser<T extends Contents> = (
  bytes: Uint8Array,
  sheetIndex: number,
) => Promise<ParserMap[T][]>;

const parsers: { [K in Contents]: Parser<K> } = {
  report: reportParser,
  sales: salesParser,
};

// Keyed by File identity, so entries disappear together with the file.
const bytesCache = new WeakMap<File, Promise<Uint8Array>>();
const resultCache = new WeakMap<File, Map<string, Promise<unknown>>>();

function readBytes(file: File) {
  let bytes = bytesCache.get(file);

  if (!bytes) {
    bytes = file.arrayBuffer().then((buffer) => new Uint8Array(buffer));
    bytesCache.set(file, bytes);
    bytes.catch(() => bytesCache.delete(file));
  }

  return bytes;
}

/**
 * Parses one sheet of `file`. The file is read once and every (content, sheet)
 * result is cached, so several components asking for the same sheet — or the
 * user flipping back to a date they already viewed — never re-parse.
 */
export function parseSheet<T extends Contents>(
  file: File,
  content: T,
  sheetIndex: number,
): Promise<ParserMap[T][]> {
  let results = resultCache.get(file);

  if (!results) {
    results = new Map();
    resultCache.set(file, results);
  }

  const key = `${content}:${sheetIndex}`;
  let result = results.get(key);

  if (!result) {
    const parse = parsers[content] as Parser<T>;
    const pending = readBytes(file).then((bytes) => parse(bytes, sheetIndex));

    result = pending;
    results.set(key, pending);
    // Never cache failures (e.g. a missing sheet may exist after a new upload).
    pending.catch(() => results.delete(key));
  }

  return result as Promise<ParserMap[T][]>;
}
