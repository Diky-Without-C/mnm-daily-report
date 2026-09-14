import { useState } from "react";
import type { Report } from "@apps/supabase/report.dto";
import { supabaseService } from "@apps/supabase/service";
import { useOrdersStore } from "@stores/useOrders.store";
import type { ContainerType } from "@apps/constants";

export interface StuffingForm {
  item: Report | null;
  stuffingQty: number;
  containerCategory: ContainerType;
  containerNumber: number;
  clearOrder: boolean;
}

const initialForm: StuffingForm = {
  item: null,
  stuffingQty: 0,
  containerCategory: "MC",
  containerNumber: 0,
  clearOrder: false,
};

export default function useStuffing() {
  const [form, setForm] = useState<StuffingForm>(initialForm);

  const { setOrders } = useOrdersStore();

  const selectItem = (item: Report) => {
    setForm((prev) => {
      if (prev.item?.id === item.id) {
        return prev;
      }

      return {
        item,
        stuffingQty: item.amount,
        containerCategory: prev.containerCategory,
        containerNumber: prev.containerNumber,
        clearOrder: prev.clearOrder,
      };
    });
  };

  const handleChange = (name: string, value: string | number | boolean) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      containerNumber: form.containerNumber,
    });
  };

  const handleSubmit = async () => {
    if (!form.item) {
      throw new Error("Item not selected");
    }

    const stuffingQty = Number(form.stuffingQty);
    const containerCategory = form.containerCategory;
    const containerNumber = Number(form.containerNumber);

    const remainingQty = form.item.amount - stuffingQty;

    const { id, ...payload } = form.item;

    const containerItem = {
      ...payload,
      category: "container",
      from: containerCategory,
      number: containerNumber,
      amount: stuffingQty,
    };

    const createData = async () => {
      const created = await supabaseService.create("report", containerItem);

      if (created) {
        setOrders((prev) => [...prev, created]);
      }
    };

    const updateData = async (update: { [key: string]: unknown }) => {
      await supabaseService.update("report", id, update);

      setOrders((prev) =>
        prev.map((item) =>
          item.id === form.item?.id ? { ...item, ...update } : item,
        ),
      );
    };

    if (remainingQty > 0 && !form.clearOrder) {
      await createData();
      await updateData({ amount: remainingQty });
    } else {
      await updateData({
        category: "container",
        from: containerCategory,
        number: containerNumber,
        amount: stuffingQty,
      });
    }

    resetForm();
  };

  return {
    form,
    handler: {
      selectItem,
      handleChange,
      handleSubmit,
      resetForm,
    },
  };
}
