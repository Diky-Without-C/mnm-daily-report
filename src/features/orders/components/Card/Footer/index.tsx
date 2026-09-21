import Pagination from "@components/Pagination";
import SelectionBar from "./SelectionBar";
import type { useCard } from "../useCard";

interface FooterProps {
  selection: ReturnType<typeof useCard>["selection"];
  pagination: ReturnType<typeof useCard>["pagination"];
  deletion: ReturnType<typeof useCard>["deletion"];
}

export default function Footer({
  selection,
  pagination,
  deletion,
}: FooterProps) {
  return (
    <div className="flex h-16 w-full items-center justify-between px-2 py-2">
      <SelectionBar selection={selection} deletion={deletion} />
      <Pagination {...pagination} />
    </div>
  );
}
