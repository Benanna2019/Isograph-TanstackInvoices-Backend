import DataLoader from "dataloader";
import { invoiceClient } from "../clients/invoice.client";
import * as R from "ramda";

type Invoice = {
  id: string;
  number: number;
  invoiceDate: Date;
  dueDate: Date;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Create a batch loader for invoices by ID
export const createInvoiceByIdLoader = () => {
  return new DataLoader<string, Invoice | null>(async (invoiceIds) => {
    const invoices = await invoiceClient.findMany({
      where: { id: { in: [...invoiceIds] } },
    });

    const invoiceMap = R.indexBy((invoice: Invoice) => invoice.id, invoices);

    return invoiceIds.map((id) => invoiceMap[id] || null);
  });
};

// Create a batch loader for invoice details
export const createInvoiceDetailsLoader = () => {
  return new DataLoader<string, any>(async (invoiceIds) => {
    const invoices = await invoiceClient.findMany({
      where: { id: { in: [...invoiceIds] } },
      select: {
        id: true,
        number: true,
        invoiceDate: true,
        dueDate: true,
        customer: {
          select: { id: true, name: true },
        },
        lineItems: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            description: true,
          },
        },
        deposits: {
          select: { id: true, amount: true, depositDate: true },
        },
      },
    });

    const invoiceMap = R.indexBy((invoice: any) => invoice.id, invoices);

    return invoiceIds.map((id) => invoiceMap[id] || null);
  });
};
