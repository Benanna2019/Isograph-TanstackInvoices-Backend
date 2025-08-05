import {
  Deposit,
  CreateDeposit,
  DepositListItem,
  CreateDepositSchema,
} from "../models";
import type DataLoader from "dataloader";

// Dependencies interface
export interface DepositApiDeps {
  depositClient: any;
  depositByIdLoader: DataLoader<string, Deposit | null>;
  depositsByInvoiceIdLoader: DataLoader<string, Deposit[]>;
}

export const createDepositApi = (deps: DepositApiDeps) => {
  const { depositClient, depositByIdLoader, depositsByInvoiceIdLoader } = deps;

  return {
    async getDepositListItems(): Promise<DepositListItem[]> {
      const deposits = await depositClient.findMany({
        orderBy: {
          depositDate: "desc",
        },
        select: {
          id: true,
          depositDate: true,
          amount: true,
          invoice: {
            select: {
              id: true,
              number: true,
              customer: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return deposits.map((d: any) => ({
        ...d,
        depositDateFormatted: d.depositDate.toLocaleDateString(),
      }));
    },

    async getDepositDetails(depositId: string): Promise<Deposit | null> {
      return depositByIdLoader.load(depositId);
    },

    async getDepositsByInvoiceId(invoiceId: string): Promise<Deposit[]> {
      return depositsByInvoiceIdLoader.load(invoiceId);
    },

    async createDeposit(data: CreateDeposit): Promise<Deposit> {
      // Validate input
      const validated = CreateDepositSchema.parse(data);

      return depositClient.create({
        data: validated,
      });
    },

    async deleteDeposit(id: string): Promise<Deposit> {
      return depositClient.delete({
        where: { id },
      });
    },
  };
};
