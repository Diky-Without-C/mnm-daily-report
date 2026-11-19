import Divider from "@components/Divider";

export default function RulesPanel() {
  return (
    <section className="flex h-full w-full flex-col">
      <header className="shrink-0 px-3 py-4">
        <h1 className="text-xl font-semibold">Rules Manager</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your rules here.</p>
      </header>
      <Divider />
    </section>
  );
}
