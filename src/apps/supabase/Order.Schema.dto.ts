import { z } from "zod";
import { ITEM_TYPES } from "@constants/Report";
import { ORDER_CATEGORIES, CONTAINER_TYPES } from "@constants/Order";

export const OrderSchema = z.object({
  id: z.string(),
  category: z.enum(ORDER_CATEGORIES),
  type: z.enum(ITEM_TYPES),
  amount: z.number().positive(),
  code: z.string().trim().uppercase(),
  from: z.enum(CONTAINER_TYPES),
  number: z.number().positive(),
});

export type OrderSchema = z.infer<typeof OrderSchema>;
