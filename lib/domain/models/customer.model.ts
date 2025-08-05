import { z } from "zod";

// Base customer schema
export const CustomerSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1, "Name is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for creating a customer
export const CreateCustomerSchema = CustomerSchema.pick({
  email: true,
  name: true,
});

// Schema for customer list items
export const CustomerListItemSchema = CustomerSchema.pick({
  id: true,
  email: true,
  name: true,
});

// Schema for customer info (used in details)
export const CustomerInfoSchema = CustomerSchema.pick({
  name: true,
  email: true,
});

// Type exports
export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type CustomerListItem = z.infer<typeof CustomerListItemSchema>;
export type CustomerInfo = z.infer<typeof CustomerInfoSchema>;
