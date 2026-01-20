export const clearCode = (code: string) => {
  const match = code.match(/([a-z]{2}\d+)/gi);

  return match ? match[match.length - 1] : code;
};
