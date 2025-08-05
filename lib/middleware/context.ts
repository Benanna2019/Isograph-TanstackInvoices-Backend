import { IncomingMessage } from "http";
import { customerClient, invoiceClient, depositClient } from "../clients";
import {
  createCustomerByIdLoader,
  createCustomerInfoLoader,
  createInvoiceByIdLoader,
  createInvoiceDetailsLoader,
  createDepositByIdLoader,
  createDepositsByInvoiceIdLoader,
} from "../dataloaders";
import {
  createCustomerApi,
  createInvoiceApi,
  createDepositApi,
} from "../domain/apis";

export interface DomainContext {
  // Clients
  clients: {
    customerClient: typeof customerClient;
    invoiceClient: typeof invoiceClient;
    depositClient: typeof depositClient;
  };

  // Dataloaders
  dataloaders: {
    customerByIdLoader: ReturnType<typeof createCustomerByIdLoader>;
    customerInfoLoader: ReturnType<typeof createCustomerInfoLoader>;
    invoiceByIdLoader: ReturnType<typeof createInvoiceByIdLoader>;
    invoiceDetailsLoader: ReturnType<typeof createInvoiceDetailsLoader>;
    depositByIdLoader: ReturnType<typeof createDepositByIdLoader>;
    depositsByInvoiceIdLoader: ReturnType<
      typeof createDepositsByInvoiceIdLoader
    >;
  };

  // APIs
  apis: {
    customerApi: ReturnType<typeof createCustomerApi>;
    invoiceApi: ReturnType<typeof createInvoiceApi>;
    depositApi: ReturnType<typeof createDepositApi>;
  };
}

export function createContext(_req?: IncomingMessage): DomainContext {
  // Create dataloaders (new instance per request to avoid cache issues)
  const dataloaders = {
    customerByIdLoader: createCustomerByIdLoader(),
    customerInfoLoader: createCustomerInfoLoader(),
    invoiceByIdLoader: createInvoiceByIdLoader(),
    invoiceDetailsLoader: createInvoiceDetailsLoader(),
    depositByIdLoader: createDepositByIdLoader(),
    depositsByInvoiceIdLoader: createDepositsByInvoiceIdLoader(),
  };

  // Create APIs with dependencies
  const customerApi = createCustomerApi({
    customerClient,
    customerByIdLoader: dataloaders.customerByIdLoader,
    customerInfoLoader: dataloaders.customerInfoLoader,
  });

  const invoiceApi = createInvoiceApi({
    invoiceClient,
    invoiceByIdLoader: dataloaders.invoiceByIdLoader,
    invoiceDetailsLoader: dataloaders.invoiceDetailsLoader,
  });

  const depositApi = createDepositApi({
    depositClient,
    depositByIdLoader: dataloaders.depositByIdLoader,
    depositsByInvoiceIdLoader: dataloaders.depositsByInvoiceIdLoader,
  });

  return {
    clients: {
      customerClient,
      invoiceClient,
      depositClient,
    },
    dataloaders,
    apis: {
      customerApi,
      invoiceApi,
      depositApi,
    },
  };
}
