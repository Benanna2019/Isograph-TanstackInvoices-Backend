import { prisma } from "../../db";

export const invoiceClient = {
  async findMany(args?: Parameters<typeof prisma.invoice.findMany>[0]) {
    return prisma.invoice.findMany(args);
  },

  async findUnique(args: Parameters<typeof prisma.invoice.findUnique>[0]) {
    return prisma.invoice.findUnique(args);
  },

  async findFirst(args?: Parameters<typeof prisma.invoice.findFirst>[0]) {
    return prisma.invoice.findFirst(args);
  },

  async create(args: Parameters<typeof prisma.invoice.create>[0]) {
    return prisma.invoice.create(args);
  },

  async update(args: Parameters<typeof prisma.invoice.update>[0]) {
    return prisma.invoice.update(args);
  },

  async delete(args: Parameters<typeof prisma.invoice.delete>[0]) {
    return prisma.invoice.delete(args);
  },
};
