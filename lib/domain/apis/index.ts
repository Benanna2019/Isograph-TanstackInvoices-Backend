import { createContext } from "../../middleware/context";

export * from "./customer.api";
export * from "./invoice.api";
export * from "./deposit.api";

export type ApiContext = ReturnType<typeof createContext>;
