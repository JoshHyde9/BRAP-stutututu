import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient({ log: ["query", "error"] });

const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
