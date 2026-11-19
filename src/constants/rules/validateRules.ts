import {
  CUSTOM_TITLES,
  ITEM_TO_MERGE,
  ITEM_TO_SPLIT,
  type MergeRule,
} from "./report.rules";
import { CODE_GROUPS, SALES_ITEMS_TO_REPLACE } from "./sales.rules";

const ruleKey = (rule: MergeRule): string =>
  JSON.stringify(Object.entries(rule).sort(([a], [b]) => a.localeCompare(b)));

const findDuplicates = (values: readonly string[]) =>
  values.filter((value, index) => values.indexOf(value) !== index);

/** Returns a list of human-readable problems. Empty list = rules look sane. */
export function validateRules(): string[] {
  const problems: string[] = [];

  // Validate split rules
  for (const dup of findDuplicates(ITEM_TO_SPLIT.map(ruleKey))) {
    problems.push(`ITEM_TO_SPLIT has duplicate entry "${dup}"`);
  }

  // Validate merge rules
  for (const [index, [parent, ...children]] of ITEM_TO_MERGE.entries()) {
    if (!parent) {
      problems.push(`merge rule #${index}: empty parent`);
      continue;
    }

    if (children.length === 0) {
      problems.push(`merge rule #${index}: empty child`);
      continue;
    }

    const parentKey = ruleKey(parent);
    const childKeys = children.map(ruleKey);

    if (childKeys.includes(parentKey)) {
      problems.push(`merge rule #${index}: parent is also a child`);
    }

    for (const dup of findDuplicates(childKeys)) {
      problems.push(`merge rule #${index}: duplicate child "${dup}"`);
    }
  }

  // Validate mapping tables
  const tables: Record<string, Record<string, string>> = {
    SALES_ITEMS_TO_REPLACE,
    CUSTOM_TITLES,
    CODE_GROUPS,
  };

  for (const [tableName, table] of Object.entries(tables)) {
    for (const [from, to] of Object.entries(table)) {
      if (from.trim() === "") {
        problems.push(`${tableName}: empty key`);
      }

      if (to.trim() === "") {
        problems.push(`${tableName}: empty value for "${from}"`);
      }

      // CODE_GROUPS legitimately maps a canonical code to itself.
      if (from === to && tableName !== "CODE_GROUPS") {
        problems.push(`${tableName}: "${from}" maps to itself`);
      }
    }
  }

  return problems;
}
