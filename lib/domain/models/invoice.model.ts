import { z } from "zod";

// Due status enum
export const DueStatusSchema = z.enum(["paid", "overpaid", "overdue", "due"]);
export type DueStatus = z.infer<typeof DueStatusSchema>;

// Line item schema
export const LineItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  invoiceId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Line item fields for creation
export const LineItemFieldsSchema = LineItemSchema.pick({
  description: true,
  quantity: true,
  unitPrice: true,
});

// Deposit schema
export const DepositSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  depositDate: z.date(),
  note: z.string(),
  invoiceId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Base invoice schema
export const InvoiceSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  invoiceDate: z.date(),
  dueDate: z.date(),
  customerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for creating an invoice
export const CreateInvoiceSchema = z.object({
  dueDate: z.date(),
  customerId: z.string(),
  lineItems: z
    .array(LineItemFieldsSchema)
    .min(1, "At least one line item is required"),
});

// Schema for invoice derived data
export const InvoiceDerivedDataSchema = z.object({
  totalAmount: z.number(),
  totalDeposits: z.number(),
  daysToDueDate: z.number(),
  dueStatus: DueStatusSchema,
  dueStatusDisplay: z.string(),
});

// Schema for invoice list item
export const InvoiceListItemSchema = InvoiceSchema.pick({
  id: true,
  number: true,
})
  .merge(InvoiceDerivedDataSchema)
  .extend({
    name: z.string(), // customer name
  });

// Type exports
export type LineItem = z.infer<typeof LineItemSchema>;
export type LineItemFields = z.infer<typeof LineItemFieldsSchema>;
export type Deposit = z.infer<typeof DepositSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type CreateInvoice = z.infer<typeof CreateInvoiceSchema>;
export type InvoiceDerivedData = z.infer<typeof InvoiceDerivedDataSchema>;
export type InvoiceListItem = z.infer<typeof InvoiceListItemSchema>;
