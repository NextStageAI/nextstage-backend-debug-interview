import { PrismaClient } from "@prisma/client";

export async function exportOpportunitiesToCSV(prisma: PrismaClient) {
  const opportunities = await prisma.opportunity.findMany();
  const csv = opportunities
    .map((opportunity) => {
      return "";
    })
    .join("\n");

  return csv;
}

export async function searchOpportunities(prisma: PrismaClient, query: string) {
  const opportunities = await prisma.opportunity.findMany({
    where: {
      title: {
        contains: query,
      },
    },
  });

  return opportunities;
}
