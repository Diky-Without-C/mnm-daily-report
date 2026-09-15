import { useCallback, useRef, useState } from "react";
import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import { supabaseService } from "@apps/supabase/service";
import { ITEM_TYPES, CONTAINER_TYPES } from "@apps/constants";
import type { OrderCategoryType } from "../order.type";

interface UseOrderFormParams {
  category: OrderCategoryType;
  setOrders: React.Dispatch<React.SetStateAction<OrderSchema[]>>;
}

export function useOrderForm({ category, setOrders }: UseOrderFormParams) {
  const [form, setForm] = useState<OrderSchema | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormRef = useRef<OrderSchema | null>(null);

  const handleEdit = useCallback((order: OrderSchema) => {
    setForm({ ...order });
    initialFormRef.current = { ...order };
  }, []);

  const handleAdd = useCallback(() => {
    const newForm: OrderSchema = {
      id: "",
      code: "",
      category: category,
      from: CONTAINER_TYPES[0],
      number: 0,
      amount: 0,
      type: Object.values(ITEM_TYPES)[0],
    };

    setForm(newForm);
    initialFormRef.current = null;
  }, [category]);

  const handleChange = useCallback((name: string, value: string | number) => {
    setForm((prev) => (prev ? { ...prev, [name]: value } : null));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { id, ...rawPayload } = form;

      const payload = {
        ...rawPayload,
        code: String(rawPayload.code).toUpperCase(),
        amount: Number(rawPayload.amount),
        number: Number(rawPayload.number),
      };

      const initial = initialFormRef.current;
      const isEdit = Boolean(id);

      if (isEdit && initial) {
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

      if (isEdit) {
        await supabaseService.update("report", id, payload);

        setOrders((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...payload } : item)),
        );
      } else {
        const created = await supabaseService.create("report", payload);

        if (created) {
          setOrders((prev) => [...prev, created]);
        }
      }

      setForm(null);
    } catch (error) {
      console.error("Failed to submit order:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isSubmitting, setOrders]);

  const closeForm = useCallback(() => {
    setForm(null);
  }, []);

  return {
    form,
    isSubmitting,
    handlers: {
      handleAdd,
      handleEdit,
      handleChange,
      handleSubmit,
      closeForm,
    },
  };
}
