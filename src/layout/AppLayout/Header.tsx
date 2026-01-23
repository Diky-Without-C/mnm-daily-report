export default function Header() {
  const currentDate = new Date().toLocaleDateString("en-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex h-16 w-full items-end gap-2 border-b-2 border-gray-400/30 px-6 py-3">
      <h1 className="text-3xl font-bold">Daily Report </h1>
      <span className="text-lg font-semibold">({currentDate})</span>
    </header>
  );
}
