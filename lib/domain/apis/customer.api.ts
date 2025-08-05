import {
  Customer,
  CreateCustomer,
  CustomerListItem,
  CustomerInfo,
  CreateCustomerSchema,
} from "../models";
import type DataLoader from "dataloader";
import { getInvoiceDerivedData } from "../utils/invoice.utils";

// Dependencies interface
export interface CustomerApiDeps {
  customerClient: any;
  customerByIdLoader: DataLoader<string, Customer | null>;
  customerInfoLoader: DataLoader<string, CustomerInfo | null>;
}

export const createCustomerApi = (deps: CustomerApiDeps) => {
  const { customerClient, customerByIdLoader, customerInfoLoader } = deps;

  return {
    async searchCustomers(query: string): Promise<CustomerListItem[]> {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const customers = await customerClient.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      const lowerQuery = query.toLowerCase();
      return customers.filter((c: CustomerListItem) => {
        return (
          c.name.toLowerCase().includes(lowerQuery) ||
          c.email.toLowerCase().includes(lowerQuery)
        );
      });
    },

    async getFirstCustomer(): Promise<Customer | null> {
      return customerClient.findFirst();
    },

    async getCustomerListItems(): Promise<CustomerListItem[]> {
      return customerClient.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    },

    async getCustomerInfo(customerId: string): Promise<CustomerInfo | null> {
      return customerInfoLoader.load(customerId);
    },

    async getCustomerById(customerId: string): Promise<Customer | null> {
      return customerByIdLoader.load(customerId);
    },

    async getCustomerDetails(customerId: string): Promise<any> {
      // Add artificial delay as in original code
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 3000 + 1500)
      );

      const customer = await customerClient.findUnique({
        where: { id: customerId },
        select: {
          id: true,
          name: true,
          email: true,
          invoices: {
            select: {
              id: true,
              dueDate: true,
              number: true,
              lineItems: {
                select: {
                  quantity: true,
                  unitPrice: true,
                },
              },
              deposits: {
                select: { amount: true },
              },
            },
          },
        },
      });

      if (!customer) return null;

      // Calculate invoice derived data using utility function
      const invoiceDetails = customer.invoices.map((invoice: any) => ({
        id: invoice.id,
        number: invoice.number,
        ...getInvoiceDerivedData(invoice),
      }));

      return {
        name: customer.name,
        email: customer.email,
        invoiceDetails,
      };
    },

    async createCustomer(data: CreateCustomer): Promise<Customer> {
      // Validate input
      const validated = CreateCustomerSchema.parse(data);

      return customerClient.create({
        data: {
          email: validated.email,
          name: validated.name,
        },
      });
    },
  };
};
