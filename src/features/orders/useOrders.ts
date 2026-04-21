import { useMemo, useState } from "react";
import type { Report } from "@/app/supabase/report.dto";
import { supabaseService } from "@/app/supabase/service";
import { ITEM_TYPES, CONTAINER_TYPES } from "@/app/constants";
import { ADD_ORDER_ID } from "./order.constants";
import { filterOrders, sortOrders } from "./order.helpers";
import type { OrderCategoryType } from "./order.type";
import { useOrdersStore } from "@/store/useOrders.store";

interface UseOrderPageParams {
  mode: OrderCategoryType;
}

export default function useOrderPage({ mode }: UseOrderPageParams) {
  const { orders: ordersStore, setOrders } = useOrdersStore();

  const [search, setSearch] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState<Report | null>(null);

  const orders = useMemo(() => {
    return filterOrders(
      ordersStore.filter((item) => item.category === mode).sort(sortOrders),
      search,
    );
  }, [ordersStore, mode, search]);

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

    if (id === ADD_ORDER_ID) {
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
