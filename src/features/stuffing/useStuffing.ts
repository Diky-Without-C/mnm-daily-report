import { useState } from "react";
import type { Report } from "@/app/supabase/report.dto";
import { supabaseService } from "@/app/supabase/service";
import { useOrdersStore } from "@/store/useOrders.store";

export interface StuffingForm {
  item: Report | null;
  stuffingQty: number;
  containerNumber: number | string;
}

const initialForm: StuffingForm = {
  item: null,
  stuffingQty: 0,
  containerNumber: "",
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
        containerNumber: "",
      };
    });
  };

  const handleChange = (name: string, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [name]: String(value),
    }));
  };

  const resetForm = () => {
    setForm(
      form.containerNumber == ""
        ? initialForm
        : {
            ...initialForm,
            containerNumber: form.containerNumber,
          },
    );
  };

  const handleSubmit = async () => {
    if (!form.item) {
      throw new Error("Item not selected");
    }

    const stuffingQty = Number(form.stuffingQty);
    const containerNumber = Number(form.containerNumber);

    const remainingQty = form.item.amount - stuffingQty;

    const { id, ...payload } = form.item;

    const containerItem = {
      ...payload,
      category: "container",
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

    if (remainingQty > 0) {
      await createData();
      await updateData({ amount: remainingQty });
    } else {
      await updateData({
        category: "container",
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
