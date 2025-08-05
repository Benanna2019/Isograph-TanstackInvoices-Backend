import { prisma } from "../../db";

export const depositClient = {
  async findMany(args?: Parameters<typeof prisma.deposit.findMany>[0]) {
    return prisma.deposit.findMany(args);
  },

  async findUnique(args: Parameters<typeof prisma.deposit.findUnique>[0]) {
    return prisma.deposit.findUnique(args);
  },

  async findFirst(args?: Parameters<typeof prisma.deposit.findFirst>[0]) {
    return prisma.deposit.findFirst(args);
  },

  async create(args: Parameters<typeof prisma.deposit.create>[0]) {
    return prisma.deposit.create(args);
  },

  async update(args: Parameters<typeof prisma.deposit.update>[0]) {
    return prisma.deposit.update(args);
  },

  async delete(args: Parameters<typeof prisma.deposit.delete>[0]) {
    return prisma.deposit.delete(args);
  },
};
