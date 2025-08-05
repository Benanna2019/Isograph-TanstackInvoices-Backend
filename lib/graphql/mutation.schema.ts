export const typeDefs = /* GraphQL */ `
  type Mutation {
    # Root mutation type
    _empty: String
  }
`;

export const resolvers = {
  Mutation: {
    _empty: () => null,
  },
};

export const transformers = {};
