import { ApiContext } from "../domain/apis";

export const typeDefs = /* GraphQL */ `
  type Customer {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
    updatedAt: String!
    invoices: [Invoice!]!
  }

  type CustomerInfo {
    name: String!
    email: String!
  }

  type CustomerListItem {
    id: ID!
    email: String!
    name: String!
  }

  type CustomerDetails {
    name: String!
    email: String!
    invoiceDetails: [InvoiceDetail!]!
  }

  type InvoiceDetail {
    id: ID!
    number: Int!
    totalAmount: Float!
    totalDeposits: Float!
    daysToDueDate: Int!
    dueStatus: DueStatus!
    dueStatusDisplay: String!
  }

  input CreateCustomerInput {
    email: String!
    name: String!
  }

  extend type Query {
    customers: [CustomerListItem!]!
    customer(id: ID!): Customer
    customerInfo(id: ID!): CustomerInfo
    customerDetails(id: ID!): CustomerDetails
    searchCustomers(query: String!): [CustomerListItem!]!
    firstCustomer: Customer
  }

  extend type Mutation {
    createCustomer(input: CreateCustomerInput!): Customer!
  }
`;

export const resolvers = {
  Query: {
    customers: async (_: any, _args: any, context: ApiContext) => {
      return context.apis.customerApi.getCustomerListItems();
    },

    customer: async (_: any, args: { id: string }, context: ApiContext) => {
      return context.apis.customerApi.getCustomerById(args.id);
    },

    customerInfo: async (_: any, args: { id: string }, context: ApiContext) => {
      return context.apis.customerApi.getCustomerInfo(args.id);
    },

    customerDetails: async (
      _: any,
      args: { id: string },
      context: ApiContext
    ) => {
      return context.apis.customerApi.getCustomerDetails(args.id);
    },

    searchCustomers: async (
      _: any,
      args: { query: string },
      context: ApiContext
    ) => {
      return context.apis.customerApi.searchCustomers(args.query);
    },

    firstCustomer: async (_: any, _args: any, context: ApiContext) => {
      return context.apis.customerApi.getFirstCustomer();
    },
  },

  Mutation: {
    createCustomer: async (
      _: any,
      args: { input: any },
      context: ApiContext
    ) => {
      return context.apis.customerApi.createCustomer(args.input);
    },
  },

  Customer: {
    // Lazy load invoices if needed
    invoices: async (parent: any, _args: any, context: ApiContext) => {
      return context.apis.invoiceApi.getInvoicesByCustomerId(parent.id);
    },
  },
};

export const transformers = {};
