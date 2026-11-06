import {
  CUSTOM_TITLES,
  ITEM_SPLIT_BY_CODE,
  ITEM_SPLIT_BY_NAME,
  ITEM_TO_MERGE,
  ITEMS_TO_REPLACE,
  type MergeRule,
} from "./report.rules";
import { CODE_GROUPS, SALES_ITEMS_TO_REPLACE } from "./sales.rules";

const ruleKey = (rule: MergeRule) =>
  "code" in rule ? `code:${rule.code}` : `name:${rule.name}`;

const findDuplicates = (values: readonly string[]) =>
  values.filter((value, index) => values.indexOf(value) !== index);

/** Returns a list of human-readable problems. Empty list = rules look sane. */
export function validateRules(): string[] {
  const problems: string[] = [];

  for (const dup of findDuplicates(ITEM_SPLIT_BY_CODE)) {
    problems.push(`ITEM_SPLIT_BY_CODE has duplicate entry "${dup}"`);
  }
  for (const dup of findDuplicates(ITEM_SPLIT_BY_NAME)) {
    problems.push(`ITEM_SPLIT_BY_NAME has duplicate entry "${dup}"`);
  }

  for (const [index, { parent, child }] of ITEM_TO_MERGE.entries()) {
    if (parent.length === 0) problems.push(`merge rule #${index}: empty parent`);
    if (child.length === 0) problems.push(`merge rule #${index}: empty child`);

    const parentKeys = new Set(parent.map(ruleKey));
    for (const rule of child) {
      if (parentKeys.has(ruleKey(rule))) {
        problems.push(`merge rule #${index}: "${ruleKey(rule)}" is parent and child`);
      }
    }
  }

  const tables: Record<string, Record<string, string>> = {
    ITEMS_TO_REPLACE,
    SALES_ITEMS_TO_REPLACE,
    CUSTOM_TITLES,
    CODE_GROUPS,
  };

  for (const [tableName, table] of Object.entries(tables)) {
    for (const [from, to] of Object.entries(table)) {
      if (from.trim() === "") problems.push(`${tableName}: empty key`);
      if (to.trim() === "") problems.push(`${tableName}: empty value for "${from}"`);
      // CODE_GROUPS legitimately maps a canonical code to itself.
      if (from === to && tableName !== "CODE_GROUPS") {
        problems.push(`${tableName}: "${from}" maps to itself`);
      }
    }
  }

  return problems;
}
