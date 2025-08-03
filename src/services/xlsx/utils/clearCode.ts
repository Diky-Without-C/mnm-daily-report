export default function clearCode(code: string) {
  const clean = code.trim();
  const match = clean.match(/([a-z]{2}\d+)/gi);

  return match ? match[match.length - 1] : clean;
}
