import { ITEM_TYPES } from "@/app/constants";

const ITEM_TYPE_REGEX = new RegExp(Object.values(ITEM_TYPES).join("|"), "gi");

export const cleanName = (name: string) =>
  name.replace(ITEM_TYPE_REGEX, "").trim();
