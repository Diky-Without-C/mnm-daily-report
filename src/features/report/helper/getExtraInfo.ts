import { EXTRA_INFO } from "@/app/constants";

const EXTRA_INFO_REGEX = new RegExp(EXTRA_INFO.join("|"), "gi");

export const getExtraInfo = (name: string) =>
  name.match(EXTRA_INFO_REGEX)?.[0] ?? "";
