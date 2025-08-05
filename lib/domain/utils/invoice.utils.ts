import { DueStatus, InvoiceDerivedData } from "../models";

// Helper function to convert date to UTC
function asUTC(date: Date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

// Calculate days to due date
export const getDaysToDueDate = (dueDate: Date) =>
  Math.ceil(
    (dueDate.getTime() - asUTC(new Date()).getTime()) / (1000 * 60 * 60 * 24)
  );

// Calculate invoice derived data
export function getInvoiceDerivedData(invoice: {
  dueDate: Date;
  lineItems: Array<{ quantity: number; unitPrice: number }>;
  deposits: Array<{ amount: number }>;
}): InvoiceDerivedData {
  const daysToDueDate = getDaysToDueDate(invoice.dueDate);

  const totalAmount = invoice.lineItems.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  const totalDeposits = invoice.deposits.reduce(
    (acc, deposit) => acc + deposit.amount,
    0
  );

  const dueStatus: DueStatus =
    totalAmount === totalDeposits
      ? "paid"
      : totalDeposits > totalAmount
      ? "overpaid"
      : daysToDueDate < 0
      ? "overdue"
      : "due";

  const dueStatusDisplay =
    dueStatus === "paid"
      ? "Paid"
      : dueStatus === "overpaid"
      ? "Overpaid"
      : dueStatus === "overdue"
      ? "Overdue"
      : daysToDueDate === 0
      ? "Due today"
      : daysToDueDate === 1
      ? "Due tomorrow"
      : `Due in ${daysToDueDate} days`;

  return {
    totalAmount,
    totalDeposits,
    daysToDueDate,
    dueStatus,
    dueStatusDisplay,
  };
}
