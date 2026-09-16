import { useCallback, useState } from "react";
import { supabaseService } from "@apps/supabase/service";
import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import { useOrdersStore } from "@stores/useOrders.store";
import { OrderFormSchema } from "./OrderForm.schema";

export interface OrderForm {
  id: string | null;
  category: string | null;
  type: string | null;
  amount: number | null;
  code: string | null;
  from: string | null;
  number: number | null;
}

export interface OrderFormError {
  type: "validation" | "server";
  message: string;
  fields?: Record<string, string>;
}

const initialForm: OrderForm = {
  id: null,
  category: null,
  type: null,
  amount: null,
  code: null,
  from: null,
  number: null,
};

export function useOrderForm() {
  const [form, setForm] = useState<OrderForm | null>(null);
  const [error, setError] = useState<OrderFormError | null>(null);

  const setOrders = useOrdersStore((state) => state.setOrders);

  const add = useCallback(() => {
    setError(null);
    setForm({ ...initialForm, category: "pre order" });
  }, []);

  const edit = useCallback((order: OrderSchema) => {
    setError(null);
    setForm({
      id: order.id,
      category: order.category,
      type: order.type,
      amount: order.amount,
      code: order.code,
      from: order.from,
      number: order.number,
    });
  }, []);

  const change = useCallback(
    <K extends keyof OrderForm>(field: K, value: OrderForm[K]) => {
      setError(null);

      setForm((prev) => ({
        ...(prev ?? initialForm),
        [field]: value,
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setError(null);
    setForm(null);
  }, []);

  const submit = useCallback(async () => {
    if (!form) return;

    setError(null);

    const result = OrderFormSchema.safeParse({
      category: form.category,
      type: form.type,
      amount: form.amount,
      code: form.code,
      from: form.from,
      number: form.number,
    });

    if (!result.success) {
      const fields: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const field = issue.path.join(".");

        if (!fields[field]) {
          fields[field] = issue.message;
        }
      }

      setError({
        type: "validation",
        message: "Please check the form.",
        fields,
      });

      return;
    }

    try {
      if (form.id) {
        await supabaseService.update("report", form.id, result.data);

        setOrders((orders) =>
          orders.map((order) =>
            order.id === form.id ? { ...order, ...result.data } : order,
          ),
        );
      } else {
        const created = await supabaseService.create("report", result.data);

        setOrders((orders) => [...orders, created]);
      }

      reset();
    } catch (error) {
      console.error("Submit failed:", error);

      setError({
        type: "server",
        message:
          error instanceof Error ? error.message : "Failed to process order.",
      });
    }
  }, [form, reset, setOrders]);

  return {
    data: form,
    error,
    add,
    edit,
    change,
    submit,
    reset,
  };
}
