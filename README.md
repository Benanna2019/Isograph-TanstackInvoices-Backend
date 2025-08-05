# Invoice Server - GraphQL API with Clean Architecture

This server has been refactored from a REST API to a GraphQL API following Clean Architecture principles.

## Architecture Overview

The application follows Clean Architecture patterns with clear separation of concerns:

```
/lib
├── domain/           # Business logic layer
│   ├── models/      # Zod schemas for entities and validation
│   ├── apis/        # Business services that encapsulate logic
│   └── utils/       # Shared utilities
├── graphql/         # Presentation layer
│   ├── *.schema.ts  # Mini-schemas for each domain
│   └── schema.ts    # Combined GraphQL schema
├── dataloaders/     # Efficient data fetching with batching
├── clients/         # Thin wrappers around Prisma (data access)
└── middleware/      # Context injection and dependency management
```

### Data Flow

1. **GraphQL** → Receives queries/mutations
2. **Business APIs** → Executes business logic
3. **DataLoaders** → Batches and caches data fetching
4. **Clients** → Thin wrappers for database access

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up your `.env` file with database connection

3. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

4. Start the server:
   ```bash
   pnpm dev:server
   ```

5. Access GraphQL Playground at: http://localhost:8080/api/graphql

## GraphQL API

### Queries

- `customers` - List all customers
- `customer(id)` - Get customer by ID
- `customerDetails(id)` - Get customer with invoice details
- `searchCustomers(query)` - Search customers by name/email
- `invoices` - List all invoices
- `invoice(id)` - Get invoice by ID
- `invoiceDetails(id)` - Get detailed invoice information
- `invoiceSummary` - Get invoice summary with amounts
- `deposits` - List all deposits
- `deposit(id)` - Get deposit by ID
- `firstDataInfo` - Get first customer and invoice IDs

### Mutations

- `createCustomer(input)` - Create a new customer
- `createInvoice(input)` - Create a new invoice
- `createDeposit(input)` - Create a new deposit
- `deleteDeposit(id)` - Delete a deposit

## Key Features

- **Clean Architecture**: Clear separation between business logic, data access, and presentation
- **Type Safety**: Zod schemas ensure runtime validation
- **Efficient Data Loading**: DataLoader prevents N+1 queries
- **GraphQL**: Flexible querying with only the data you need
- **Context Injection**: Clean dependency injection pattern# Isograph-TanstackInvoices-Backend
