import { PrismaClient } from "@prisma/client";

export function createPrismaClient(args?: { filepath?: string }) {
  const filepath = args?.filepath ?? process.env.DATABASE_URL;
  return new PrismaClient({
    datasources: {
      db: {
        url: filepath,
      },
    },
  });
}
