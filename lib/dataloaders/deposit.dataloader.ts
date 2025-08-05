import DataLoader from "dataloader";
import { depositClient } from "../clients/deposit.client";
import * as R from "ramda";

type Deposit = {
  id: string;
  amount: number;
  depositDate: Date;
  note: string;
  invoiceId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Create a batch loader for deposits by ID
export const createDepositByIdLoader = () => {
  return new DataLoader<string, Deposit | null>(async (depositIds) => {
    const deposits = await depositClient.findMany({
      where: { id: { in: [...depositIds] } },
    });

    const depositMap = R.indexBy((deposit: Deposit) => deposit.id, deposits);

    return depositIds.map((id) => depositMap[id] || null);
  });
};

// Create a batch loader for deposits by invoice ID
export const createDepositsByInvoiceIdLoader = () => {
  return new DataLoader<string, Deposit[]>(async (invoiceIds) => {
    const deposits = await depositClient.findMany({
      where: { invoiceId: { in: [...invoiceIds] } },
    });

    const depositsByInvoice = R.groupBy(
      (deposit: Deposit) => deposit.invoiceId,
      deposits
    );

    return invoiceIds.map((id) => depositsByInvoice[id] || []);
  });
};
