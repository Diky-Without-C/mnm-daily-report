import { useMemo, useRef, useState } from "react";
import type { Report } from "@apps/supabase/report.dto";
import { supabaseService } from "@apps/supabase/service";
import { ITEM_TYPES, CONTAINER_TYPES } from "@apps/constants";
import { useOrdersStore } from "@stores/useOrders.store";
import { filterOrders, sortOrders } from "./order.helpers";
import type { OrderCategoryType } from "./order.type";

interface UseOrderPageParams {
  mode: OrderCategoryType;
}

export default function useOrderList({ mode }: UseOrderPageParams) {
  const { orders: ordersStore, setOrders } = useOrdersStore();

  const [search, setSearch] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState<Report | null>(null);

  const initialFormRef = useRef<Report | null>(null);

  const orders = useMemo(() => {
    return filterOrders(
      ordersStore.filter((item) => item.category === mode).sort(sortOrders),
      search,
    );
  }, [ordersStore, mode, search]);

  const handleSearch = (value: string) => setSearch(value);

  const handleEdit = (order: Report) => {
    setForm(order);

    initialFormRef.current = structuredClone(order);
  };

  const handleAdd = () => {
    const newForm: Report = {
      id: "add",
      code: "",
      category: mode,
      from: CONTAINER_TYPES[0],
      number: 0,
      amount: 0,
      type: Object.values(ITEM_TYPES)[0],
    };

    setForm(newForm);
    initialFormRef.current = structuredClone(newForm);
  };

  const handleChange = (name: keyof Report, value: string | number) => {
    setForm((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async () => {
    if (!form) return;

    const { id, ...rawPayload } = form;

    const payload = {
      ...rawPayload,
      code: String(rawPayload.code).toUpperCase(),
      amount: Number(rawPayload.amount),
      number: Number(rawPayload.number),
    };

    const initial = initialFormRef.current;

    if (initial && id !== "add") {
      const normalizedInitial = {
        ...initial,
        code: String(initial.code).toUpperCase(),
        amount: Number(initial.amount),
        number: Number(initial.number),
      };

      const hasChanged =
        JSON.stringify(normalizedInitial) !==
        JSON.stringify({ id, ...payload });

      if (!hasChanged) {
        setForm(null);
        return;
      }
    }

    if (id === "add") {
      const created = await supabaseService.create("report", payload);

      if (created) {
        setOrders((prev) => [...prev, created]);
      }
    } else {
      await supabaseService.update("report", id, payload);

      setOrders((prev) =>
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

    setOrders((prev) => prev.filter((item) => item.id !== deleteTargetId));

    setDeleteTargetId(null);
  };

  return {
    orders,
    form,
    deleteBoxTrigger: Boolean(deleteTargetId),
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
