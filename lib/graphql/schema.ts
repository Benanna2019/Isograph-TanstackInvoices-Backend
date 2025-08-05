import { makeExecutableSchema } from "@graphql-tools/schema";
import * as R from "ramda";

// Import mini-schemas
import * as querySchema from "./query.schema";
import * as mutationSchema from "./mutation.schema";
import * as customerSchema from "./customer.schema";
import * as invoiceSchema from "./invoice.schema";
import * as depositSchema from "./deposit.schema";

// Combine all type definitions
const typeDefs = [
  querySchema.typeDefs,
  mutationSchema.typeDefs,
  customerSchema.typeDefs,
  invoiceSchema.typeDefs,
  depositSchema.typeDefs,
];

// Combine all resolvers
const resolvers = R.mergeDeepRight(
  R.mergeDeepRight(
    R.mergeDeepRight(
      R.mergeDeepRight(querySchema.resolvers, mutationSchema.resolvers),
      customerSchema.resolvers
    ),
    invoiceSchema.resolvers
  ),
  depositSchema.resolvers
);

// Create the executable schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
