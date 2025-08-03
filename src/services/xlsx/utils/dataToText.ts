import { itemTypes, ExtraInfo, CustomTitles } from "@constant/constant.json";
import type { GroupedCategories } from "./groupByCathegory";
import formatNumber from "./formatNumber";
import type { Item } from "..";
import splitByType from "./splitByType";

export default function dataToText(
  data: GroupedCategories,
  date: string,
  hulaan: string,
) {
  const categoryLabels = Object.keys(data).map((key) => [
    key,
    key.replace(/_/g, " "),
  ]);

  const cleanName = (name: string): string =>
    name.replace(new RegExp(itemTypes.join("|"), "gi"), "").trim();

  const formatGroup = (group: Item[]) => {
    const [first] = group;
    const title = CustomTitles.some((title) => first.name.includes(title.name))
      ? CustomTitles.find((title) => first.name.includes(title.name))?.to
      : `${cleanName(first.name)} (${first.code})`;

    const stockLines = splitByType(group).map((items) => {
      const isMultiple = items.length > 1;

      const result = items.flatMap((item, index) => {
        const stock = Math.max(Number(item.stock), 0);
        const extraInfo =
          item.name.match(new RegExp(`${ExtraInfo.join("|")}`, "gi"))?.[0] ||
          "";

        return `${index === 0 ? item.type : " ".repeat(item.type.length)}${isMultiple ? ` ${extraInfo === "" ? `(${index + 1})` : extraInfo}` : ""}: ${formatNumber(stock)}`;
      });

      return result.join("\n");
    });

    return `${title}\n${stockLines.join("\n")}`;
  };

  const formatCategory = (groups: Item[][], label: string): string => {
    if (!groups.length) return "";
    const formattedGroups = groups.map(formatGroup).join("\n\n");
    return `*${label}\n\n${formattedGroups}\n\n`;
  };

  const header = `LAPORAN HARIAN STOCK LAYER PVC\n${date}\n-----------------------------------`;
  const footer = `           STOCK DI HULAAN\n-----------------------------------`;

  const text = categoryLabels
    .map(([key, label]) =>
      formatCategory(data[key as keyof typeof data], label),
    )
    .join("")
    .trim();

  return `${header}\n\n${text}\n\n${footer}\n\n${hulaan}`;
}
