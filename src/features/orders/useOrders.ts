import { useEffect, useMemo, useState } from "react";
import type { Report } from "@/app/supabase/report.dto";
import { supabaseService } from "@/app/supabase/service";
import { ITEM_TYPES, CONTAINER_TYPES } from "@/app/constants";
import { ADD_ORDER_ID } from "./order.constants";
import { filterOrders, sortOrders } from "./order.helpers";
import type { OrderCategoryType } from "./order.type";

interface UseOrderPageParams {
  mode: OrderCategoryType;
}

export default function useOrderPage({ mode }: UseOrderPageParams) {
  const [data, setData] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState<Report | null>(null);

  useEffect(() => {
    supabaseService.fetchAll<Report>("report").then(setData);
  }, []);

  const orders = useMemo(() => {
    return filterOrders(
      data.filter((item) => item.category === mode).sort(sortOrders),
      search,
    );
  }, [data, mode, search]);

  const handleSearch = (value: string) => setSearch(value);

  const handleEdit = (order: Report) => setForm(order);

  const handleAdd = () =>
    setForm({
      id: ADD_ORDER_ID,
      code: "",
      category: mode,
      from: CONTAINER_TYPES[0],
      number: 0,
      amount: 0,
      type: Object.values(ITEM_TYPES)[0],
    });

  const handleChange = (name: keyof Report, value: string | number) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "amount" || name === "number"
                ? Number(value) || 0
                : name === "code"
                  ? String(value).toUpperCase()
                  : value,
          }
        : null,
    );
  };

  const handleSubmit = async () => {
    if (!form) return;

    const { id, ...payload } = form;

    if (id === ADD_ORDER_ID) {
      const created = await supabaseService.create("report", payload);
      if (created) setData((prev) => [...prev, created]);
    } else {
      await supabaseService.update("report", id, payload);
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...payload } : item)),
      );
    }

    setForm(null);
  };

  const requestDelete = (id: string) => setDeleteTargetId(id);

  const cancelDelete = () => setDeleteTargetId(null);

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    await supabaseService.remove("report", deleteTargetId);
    setData((prev) => prev.filter((item) => item.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  return {
    orders,
    form,
    deleteTargetId,
    handlers: {
      handleSearch,
      handleEdit,
      handleAdd,
      handleChange,
      handleSubmit,
      requestDelete,
      confirmDelete,
      cancelDelete,
      closeForm: () => setForm(null),
    },
  };
}
