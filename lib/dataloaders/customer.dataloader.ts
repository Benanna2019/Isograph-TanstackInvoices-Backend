import DataLoader from "dataloader";
import { customerClient } from "../clients/customer.client";
import * as R from "ramda";

type Customer = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type CustomerInfo = {
  name: string;
  email: string;
};

// Create a batch loader for customers by ID
export const createCustomerByIdLoader = () => {
  return new DataLoader<string, Customer | null>(async (customerIds) => {
    const customers = await customerClient.findMany({
      where: { id: { in: [...customerIds] } },
    });

    // Create a map for O(1) lookup
    const customerMap = R.indexBy(
      (customer: Customer) => customer.id,
      customers
    );

    // Return in the same order as requested
    return customerIds.map((id) => customerMap[id] || null);
  });
};

// Create a batch loader for customer info
export const createCustomerInfoLoader = () => {
  return new DataLoader<string, CustomerInfo | null>(async (customerIds) => {
    const customers = await customerClient.findMany({
      where: { id: { in: [...customerIds] } },
      select: { name: true, email: true, id: true },
    });

    const customerMap = R.indexBy(
      (customer: { id: string; name: string; email: string }) => customer.id,
      customers
    );

    return customerIds.map((id) => {
      const customer = customerMap[id];
      return customer ? { name: customer.name, email: customer.email } : null;
    });
  });
};
