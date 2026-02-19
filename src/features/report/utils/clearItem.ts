export const clearItem = (data: string, itemsToClear: string[]) => {
  let result = data;
  for (const item of itemsToClear) {
    result = result.replace(item, "");
  }
  return result.trim();
};
