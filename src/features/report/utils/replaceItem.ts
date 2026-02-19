export const replaceItem = (
  data: string,
  itemsToReplace: Record<string, string>,
) => {
  let result = data;

  for (const key of Object.keys(itemsToReplace)) {
    result = result.replace(key, itemsToReplace[key]);
  }

  return result;
};
