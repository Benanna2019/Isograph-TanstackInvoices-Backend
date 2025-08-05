import express from "express";
import cors from "cors";
import { getGraphQLParameters, processRequest } from "graphql-helix";
import { schema } from "./lib/graphql/schema";
import { createContext } from "./lib/middleware/context";
import { ruruHTML } from "ruru/server";
import { printSchema } from "graphql";
import { writeFileSync } from "fs";
import { resolve } from "path";

import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const port = 8080;

// Export schema on startup
const schemaPath = resolve(__dirname, "./schema.graphql");
writeFileSync(schemaPath, printSchema(schema));
console.log(`📝 Schema exported to ${schemaPath}`);

// Serve the GraphQL IDE (Ruru)
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/api/graphql" }));
});

// GraphQL endpoint
app.use("/api/graphql", async (req, res) => {
  // Create the context for this request
  const context = createContext(req);

  // Create a generic Request object from the Express request
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  // Extract the GraphQL parameters from the request
  const { operationName, query, variables } = getGraphQLParameters(request);

  // Validate and execute the query
  const result = await processRequest({
    operationName,
    query,
    variables,
    request,
    schema,
    contextFactory: () => context,
  });

  // processRequest returns one of three types of results depending on how the server should respond
  // 1) RESPONSE: a regular JSON payload
  // 2) MULTIPART RESPONSE: a multipart response (when @stream or @defer directives are used)
  // 3) PUSH: a stream of events to push back down the client for a subscription
  if (result.type === "RESPONSE") {
    // We set the provided status and headers and just the send the payload back to the client
    result.headers.forEach(({ name, value }) => res.setHeader(name, value));
    res.status(result.status);
    res.json(result.payload);
  } else if (result.type === "MULTIPART_RESPONSE") {
    // Indicate we're sending a multipart response
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": 'multipart/mixed; boundary="-"',
      "Transfer-Encoding": "chunked",
    });

    // If the request is closed by the client, we unsubscribe and stop executing the request
    req.on("close", () => {
      result.unsubscribe();
    });

    // We subscribe to the multipart response and send each part to the client
    await result.subscribe((result) => {
      const chunk = Buffer.from(JSON.stringify(result), "utf8");
      const data = [
        "",
        "---",
        "Content-Type: application/json; charset=utf-8",
        "Content-Length: " + String(chunk.length),
        "",
        chunk,
      ];

      if (result.hasNext) {
        data.push("---");
      }

      res.write(data.join("\r\n"));
    });

    res.write("\r\n-----\r\n");
    res.end();
  } else {
    // GraphQL subscriptions are not supported by this handler
    res.writeHead(501);
    res.end();
  }
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "invoice-server-graphql" });
});

app.listen(port, () => {
  console.log(
    `🚀 GraphQL server ready at http://localhost:${port}/api/graphql`
  );
  console.log(`📊 GraphQL IDE (Ruru) available at http://localhost:${port}/`);
});
