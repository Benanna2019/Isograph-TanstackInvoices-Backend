import { z } from "zod";
import { DepositSchema as BaseDepositSchema } from "./invoice.model";

// Re-export base schema with different name to avoid conflicts
export const DepositSchema = BaseDepositSchema;

// Schema for creating a deposit
export const CreateDepositSchema = DepositSchema.pick({
  amount: true,
  depositDate: true,
  note: true,
  invoiceId: true,
});

// Schema for deposit details (with formatted date)
export const DepositDetailsSchema = DepositSchema.extend({
  depositDateFormatted: z.string(),
});

// Schema for deposit list item
export const DepositListItemSchema = DepositSchema.pick({
  id: true,
  depositDate: true,
  amount: true,
}).extend({
  depositDateFormatted: z.string(),
  invoice: z.object({
    id: z.string(),
    number: z.number(),
    customer: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
});

// Type exports
export type Deposit = z.infer<typeof DepositSchema>;
export type CreateDeposit = z.infer<typeof CreateDepositSchema>;
export type DepositDetails = z.infer<typeof DepositDetailsSchema>;
export type DepositListItem = z.infer<typeof DepositListItemSchema>;
