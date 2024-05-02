import { Opportunity, PrismaClient } from "@prisma/client";
import { CustomField } from "@src/types/custom-field";

function createCSVRowFromOpportunityData(
  opportunity: Opportunity,
  workspaceCustomFields: CustomField[]
) {
  const opportunityData = JSON.parse(opportunity.opportunityData);

  const row =
    opportunity.title +
    "," +
    // For each custom field defined in the workspace, look up the value
    // for that field in the opportunity data and add it to the CSV row
    workspaceCustomFields
      .map((field: CustomField) => {
        const fieldValue = opportunityData[field.id];

        // If the opportunity does not have a value for this field, return "N/A"
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
}

export async function exportWorkspaceOpportunitiesToCSV(prisma: PrismaClient) {
  const workspace = await prisma.workspace.findFirst();

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const workspaceCustomFields: CustomField[] = JSON.parse(
    workspace.customFieldDefinition
  );

  const opportunities = await prisma.opportunity.findMany();

  const headerCSV =
    "Title," +
    workspaceCustomFields.map((field: CustomField) => field.name).join(",");

  const opportunitiesCSV = opportunities
    .map((opportunity) => {
      const row = createCSVRowFromOpportunityData(
        opportunity,
        workspaceCustomFields
      );
      return row;
    })
    .join("\n");

  return headerCSV + "\n" + opportunitiesCSV;
}
