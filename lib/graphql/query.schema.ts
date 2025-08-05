export const typeDefs = /* GraphQL */ `
  type Query {
    # First data info
    firstDataInfo: FirstDataInfo!
  }

  type FirstDataInfo {
    firstInvoiceId: ID
    firstCustomerId: ID
  }
`;

export const resolvers = {
  Query: {
    firstDataInfo: async (_: any, _args: any, context: any) => {
      const [firstInvoice, firstCustomer] = await Promise.all([
        context.apis.invoiceApi.getFirstInvoice(),
        context.apis.customerApi.getFirstCustomer(),
      ]);

      return {
        firstInvoiceId: firstInvoice?.id || null,
        firstCustomerId: firstCustomer?.id || null,
      };
    },
  },
};

export const transformers = {};
