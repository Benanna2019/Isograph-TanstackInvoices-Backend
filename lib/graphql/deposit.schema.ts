import { ApiContext } from "../domain/apis";

export const typeDefs = /* GraphQL */ `
  type Deposit {
    id: ID!
    amount: Float!
    depositDate: String!
    note: String!
    invoiceId: String!
    invoice: Invoice!
    createdAt: String!
    updatedAt: String!
  }

  type DepositListItem {
    id: ID!
    depositDate: String!
    depositDateFormatted: String!
    amount: Float!
    invoice: InvoiceWithCustomer!
  }

  type InvoiceWithCustomer {
    id: ID!
    number: Int!
    customer: CustomerRef!
  }

  input CreateDepositInput {
    amount: Float!
    depositDate: String!
    note: String!
    invoiceId: String!
  }

  extend type Query {
    deposits: [DepositListItem!]!
    deposit(id: ID!): Deposit
  }

  extend type Mutation {
    createDeposit(input: CreateDepositInput!): Deposit!
    deleteDeposit(id: ID!): Deposit!
  }
`;

export const resolvers = {
  Query: {
    deposits: async (_: any, _args: any, context: ApiContext) => {
      return context.apis.depositApi.getDepositListItems();
    },

    deposit: async (_: any, args: { id: string }, context: ApiContext) => {
      return context.apis.depositApi.getDepositDetails(args.id);
    },
  },

  Mutation: {
    createDeposit: async (
      _: any,
      args: { input: any },
      context: ApiContext
    ) => {
      // Parse date string to Date object
      const input = {
        ...args.input,
        depositDate: new Date(args.input.depositDate),
      };
      return context.apis.depositApi.createDeposit(input);
    },

    deleteDeposit: async (
      _: any,
      args: { id: string },
      context: ApiContext
    ) => {
      return context.apis.depositApi.deleteDeposit(args.id);
    },
  },

  Deposit: {
    invoice: async (parent: any, _args: any, context: ApiContext) => {
      return context.dataloaders.invoiceByIdLoader.load(parent.invoiceId);
    },

    depositDate: (parent: any) => parent.depositDate.toISOString(),
    createdAt: (parent: any) => parent.createdAt.toISOString(),
    updatedAt: (parent: any) => parent.updatedAt.toISOString(),
  },
};

export const transformers = {};
