import { PrismaClient } from "@prisma/client";
import { CustomField } from "src/types/custom-field";

export async function exportOpportunitiesToCSV(
  prisma: PrismaClient,
  workspaceId: number
) {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const workspaceCustomFields = JSON.parse(workspace.customFieldDefinition);

  const opportunities = await prisma.opportunity.findMany({
    where: {
      workspaceId: workspaceId,
    },
  });

  const headerCSV =
    "Title," +
    workspaceCustomFields.map((field: CustomField) => field.name).join(",");

  const opportunitiesCSV = opportunities
    .map((opportunity) => {
      const opportunityData = JSON.parse(opportunity.opportunityData);

      const row =
        opportunity.title +
        "," +
        workspaceCustomFields
          .map((field: CustomField) => {
            const fieldValue = opportunityData[field.id];
            if (!fieldValue) {
              return "N/A";
            }

            if (field.type === "multi-dropdown") {
              return fieldValue.value.label;
            } else if (field.type === "date") {
              return fieldValue.value;
            } else {
              return "N/A";
            }
          })
          .join(",");

      return row;
    })
    .join("\n");

  return headerCSV + "\n" + opportunitiesCSV;
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
