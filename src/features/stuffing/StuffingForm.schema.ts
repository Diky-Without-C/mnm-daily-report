import { z } from "zod";
import { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import { CONTAINER_TYPES } from "@/constants/Order";

export const StuffingFormSchema = z.object({
  item: OrderSchema.nullable().refine((value) => value !== null, {
    message: "Please select an item",
  }),
  stuffingQty: z
    .number({ message: "Quantity must be a valid number" })
    .positive("Quantity must be > 0"),
  container: z.object({
    type: z.enum(CONTAINER_TYPES, {
      message: "Please select a container type",
    }),
    number: z
      .number({ message: "Container number must be > 0" })
      .positive("Container number must be > 0"),
  }),
  clearOrder: z.boolean(),
});

export type StuffingFormSchema = z.infer<typeof StuffingFormSchema>;
