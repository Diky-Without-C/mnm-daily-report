import { capitalize } from "@/utils/capitalize";

export function paginate<T>(items: T[], page: number, perPage: number) {
  const start = (page - 1) * perPage;

  return items.slice(start, start + perPage);
}

export const categoryToKey = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "_");

export const keyToLabel = (value: string) =>
  capitalize(value.replace(/_/g, " "));
