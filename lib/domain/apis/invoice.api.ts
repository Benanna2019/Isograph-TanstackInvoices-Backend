import {
  Invoice,
  CreateInvoice,
  InvoiceListItem,
  CreateInvoiceSchema,
} from "../models";
import type DataLoader from "dataloader";
import { getInvoiceDerivedData } from "../utils/invoice.utils";

// Dependencies interface
export interface InvoiceApiDeps {
  invoiceClient: any;
  invoiceByIdLoader: DataLoader<string, Invoice | null>;
  invoiceDetailsLoader: DataLoader<string, any>;
}

export const createInvoiceApi = (deps: InvoiceApiDeps) => {
  const { invoiceClient, invoiceDetailsLoader } = deps;

  return {
    async getFirstInvoice(): Promise<Invoice | null> {
      return invoiceClient.findFirst();
    },

    async getInvoiceListItems(): Promise<InvoiceListItem[]> {
      const invoices = await invoiceClient.findMany({
        select: {
          id: true,
          dueDate: true,
          number: true,
          customer: {
            select: { name: true },
          },
          lineItems: {
            select: { quantity: true, unitPrice: true },
          },
          deposits: {
            select: { amount: true },
          },
        },
      });

      return invoices.map((invoice: any) => {
        return {
          id: invoice.id,
          name: invoice.customer.name,
          number: invoice.number,
          ...getInvoiceDerivedData(invoice),
        };
      });
    },

    async getInvoiceDetails(invoiceId: string): Promise<any> {
      const invoice = await invoiceDetailsLoader.load(invoiceId);
      if (!invoice) return null;

      return {
        invoice,
        ...getInvoiceDerivedData(invoice),
      };
    },

    async getInvoicesByCustomerId(customerId: string): Promise<Invoice[]> {
      return invoiceClient.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
      });
    },

    async getInvoiceSummary() {
      const invoiceListItems = await this.getInvoiceListItems();

      const dueSoonAmount = invoiceListItems.reduce(
        (sum: number, li: InvoiceListItem) => {
          if (li.dueStatus !== "due") {
            return sum;
          }
          const remainingBalance = li.totalAmount - li.totalDeposits;
          return sum + remainingBalance;
        },
        0
      );

      const overdueAmount = invoiceListItems.reduce(
        (sum: number, li: InvoiceListItem) => {
          if (li.dueStatus !== "overdue") {
            return sum;
          }
          const remainingBalance = li.totalAmount - li.totalDeposits;
          return sum + remainingBalance;
        },
        0
      );

      return {
        invoiceListItems,
        dueSoonAmount,
        overdueAmount,
      };
    },

    async createInvoice(data: CreateInvoice): Promise<Invoice> {
      // Validate input
      const validated = CreateInvoiceSchema.parse(data);

      // Get the next invoice number
      const largestInvoiceNumber = await invoiceClient.findFirst({
        select: { number: true },
        orderBy: { number: "desc" },
      });

      const nextNumber = largestInvoiceNumber
        ? largestInvoiceNumber.number + 1
        : 1;

      return invoiceClient.create({
        data: {
          number: nextNumber,
          dueDate: validated.dueDate,
          customer: { connect: { id: validated.customerId } },
          lineItems: {
            create: validated.lineItems.map((li) => ({
              description: li.description,
              quantity: li.quantity,
              unitPrice: li.unitPrice,
            })),
          },
        },
      });
    },
  };
};
