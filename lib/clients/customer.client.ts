import { prisma } from "../../db";

export const customerClient = {
  async findMany(args?: Parameters<typeof prisma.customer.findMany>[0]) {
    return prisma.customer.findMany(args);
  },

  async findUnique(args: Parameters<typeof prisma.customer.findUnique>[0]) {
    return prisma.customer.findUnique(args);
  },

  async findFirst(args?: Parameters<typeof prisma.customer.findFirst>[0]) {
    return prisma.customer.findFirst(args);
  },

  async create(args: Parameters<typeof prisma.customer.create>[0]) {
    return prisma.customer.create(args);
  },

  async update(args: Parameters<typeof prisma.customer.update>[0]) {
    return prisma.customer.update(args);
  },

  async delete(args: Parameters<typeof prisma.customer.delete>[0]) {
    return prisma.customer.delete(args);
  },
};
