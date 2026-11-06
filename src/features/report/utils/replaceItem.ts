const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const patternCache = new WeakMap<object, RegExp>();

const buildPattern = (rules: Record<string, string>) => {
  // Longest key first: "BEYBLADE MC412-S" must win over "BEYBLADE MC412".
  const keys = Object.keys(rules).sort((a, b) => b.length - a.length);

  return new RegExp(keys.map(escapeRegex).join("|"), "g");
};

/**
 * Replaces every key of `rules` found in `data` with its value.
 * Single pass: replaced text is never re-scanned, so rules cannot cascade
 * into each other (which depended on object key order before).
 */
export const replaceItem = (
  data: string,
  rules: Record<string, string>,
): string => {
  if (Object.keys(rules).length === 0) return data;

  let pattern = patternCache.get(rules);

  if (!pattern) {
    pattern = buildPattern(rules);
    patternCache.set(rules, pattern);
  }

  return data.replace(pattern, (match) => rules[match]);
};
