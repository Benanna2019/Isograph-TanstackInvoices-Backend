import { printSchema } from "graphql";
import { writeFileSync } from "fs";
import { resolve } from "path";
import { schema } from "../lib/graphql/schema";

// Print the schema to a string
const schemaString = printSchema(schema);

// Write to file
const outputPath = resolve(__dirname, "../schema.graphql");
writeFileSync(outputPath, schemaString);

console.log(`✅ Schema exported to ${outputPath}`);
