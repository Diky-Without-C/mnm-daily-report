import { z } from "zod";
import { ITEM_TYPES } from "@constants/Report";
import { ORDER_CATEGORY, CONTAINER_TYPES } from "@constants/Order";

export const OrderFormSchema = z.object({
  category: z.enum(ORDER_CATEGORY, {
    message: "Please select category",
  }),
  type: z.enum(ITEM_TYPES, {
    message: "Please select a type",
  }),
  amount: z
    .number({
      message: "Amount is required",
    })
    .positive("Amount must be > 0"),
  code: z.string("Code is required").trim().uppercase(),
  from: z.enum(CONTAINER_TYPES, {
    message: "Please select a container",
  }),
  number: z
    .number({
      message: "Number is required",
    })
    .positive("Number must be > 0"),
});

export type OrderFormSchema = z.infer<typeof OrderFormSchema>;
