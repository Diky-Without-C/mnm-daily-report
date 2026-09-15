import { useCallback, useState } from "react";
import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import { supabaseService } from "@apps/supabase/service";
import type { ContainerType } from "@constants/Order";
import { useOrdersStore } from "@stores/useOrders.store";
import { StuffingFormSchema } from "./StuffingForm.schema";

interface StuffingForm {
  item: OrderSchema | null;
  stuffingQty: number | null;
  container: {
    type: ContainerType | "";
    number: number | null;
  };
  clearOrder: boolean;
}

interface StuffingError {
  type: "validation" | "server";
  message: string;
  fields?: Record<string, string>;
}

const initialForm: StuffingForm = {
  item: null,
  stuffingQty: null,
  container: {
    type: "",
    number: null,
  },
  clearOrder: false,
};

export default function useStuffing() {
  const [form, setForm] = useState<StuffingForm>(initialForm);
  const [error, setError] = useState<StuffingError | null>(null);

  const { setOrders } = useOrdersStore();

  const selectItem = useCallback((item: OrderSchema) => {
    setError(null);

    setForm((prev) => {
      if (prev.item?.id === item.id) {
        return prev;
      }

      return {
        ...prev,
        item,
        stuffingQty: item.amount,
      };
    });
  }, []);

  const clearItem = useCallback(() => {
    setError(null);
    setForm(initialForm);
  }, []);

  const setStuffingQty = useCallback((stuffingQty: number | null) => {
    setError(null);

    setForm((prev) => ({
      ...prev,
      stuffingQty,
    }));
  }, []);

  const setContainerType = useCallback((type: ContainerType | "") => {
    setError(null);

    setForm((prev) => ({
      ...prev,
      container: {
        ...prev.container,
        type,
      },
    }));
  }, []);

  const setContainerNumber = useCallback((number: number | null) => {
    setError(null);

    setForm((prev) => ({
      ...prev,
      container: {
        ...prev.container,
        number,
      },
    }));
  }, []);

  const setClearOrder = useCallback((clearOrder: boolean) => {
    setError(null);

    setForm((prev) => ({
      ...prev,
      clearOrder,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setForm({
      ...initialForm,
      container: form.container,
    });

    setError(null);
  }, [form.container]);

  const handleSubmit = useCallback(async () => {
    setError(null);

    const result = StuffingFormSchema.safeParse(form);

    if (!result.success) {
      const fields: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");

        if (!fields[field]) {
          fields[field] = issue.message;
        }
      });

      setError({
        type: "validation",
        message: "Please check the form.",
        fields,
      });

      return;
    }

    const { item, stuffingQty, container, clearOrder } = result.data;

    try {
      const remainingQty = item.amount - stuffingQty;
      const { id, ...payload } = item;

      const containerData: Omit<OrderSchema, "id"> = {
        ...payload,
        category: "container",
        from: container.type,
        number: container.number,
        amount: stuffingQty,
      };

      if (remainingQty > 0 && !clearOrder) {
        const created = await supabaseService.create("report", containerData);

        await supabaseService.update("report", id, {
          amount: remainingQty,
        });

        setOrders((prev) => [...prev, created]);

        setOrders((prev) =>
          prev.map((order) =>
            order.id === id ? { ...order, amount: remainingQty } : order,
          ),
        );
      } else {
        await supabaseService.update("report", id, containerData);

        setOrders((prev) =>
          prev.map((order) =>
            order.id === id ? { ...order, ...containerData } : order,
          ),
        );
      }

      resetForm();
    } catch (error) {
      console.error("Submit failed:", error);

      setError({
        type: "server",
        message:
          error instanceof Error
            ? error.message
            : "Failed to process stuffing.",
      });
    }
  }, [form, resetForm, setOrders]);

  return {
    form,
    error,
    handler: {
      selectItem,
      clearItem,
      setStuffingQty,
      setContainerType,
      setContainerNumber,
      setClearOrder,
      handleSubmit,
      resetForm,
    },
  };
}
