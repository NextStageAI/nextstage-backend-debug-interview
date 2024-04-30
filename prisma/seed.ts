import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomFieldOption {
    label: string;
    value: string;
    id: string;
}

type CustomFieldType = "multi-dropdown" | "date";

interface CustomField {
  id: string;
  type: CustomFieldType;
  name: string;
  options?: CustomFieldOption[];
}

const CUSTOM_FIELD_DEFINITION: CustomField[] = [
    {
        id: "customField1",
        type: "multi-dropdown",
        name: "Custom Field 1",
        options: [
            {
                label: "Option 1",
                value: "option1",
                id: "d84cf1b4-06cb-4c4d-8d0f-c459571baade",
            },
            {
                label: "Option 2",
                value: "option2",
                id: "610c84b0-e3b7-44ef-895c-0aa33282fa75",
            },
            {
                label: "Option 3",
                value: "option3",
                id: "7dc3bad2-d083-4215-a550-91cd366724de",
            },
        ],
    },
    {
        id: "customField2",
        type: "date",
        name: "Custom Field 2",
    },
];

function getSeedData(
  workspaceId: string
): Prisma.OpportunityCreateArgs["data"][] {
  return [
    {
      title: "Opportunity 1",
      workspace: { connect: { id: workspaceId } },
      opportunityData: {
        customField1: {
          type: "multi-dropdown",
          value: {
            label: "Option 1",
            value: "option1",
            id: "610c84b0-e3b7-44ef-895c-0aa33282fa75",
          },
        },
        dueDate: {
          type: "date",
          value: "",
        },
      },
    },
    {
      title: "Opportunity 2",
      workspace: { connect: { id: workspaceId } },
      opportunityData: {
        customField1: {
          type: "multi-dropdown",
          value: {
            label: "Option 1",
            value: "option1",
            id: "d84cf1b4-06cb-4c4d-8d0f-c459571baade",
          },
        },
        customField2: {
          type: "date",
          value: {
            label: "Option 2",
            value: "option2",
            id: "d84cf1b4-06cb-4c4d-8d0f-c459571baade",
          },
        },
      },
    },
    {
      title: "Opportunity 3",
      workspace: { connect: { id: workspaceId } },
      opportunityData: {
        customField1: {
          type: "multi-dropdown",
          value: {
            label: "Option 1",
            value: "option1",
            id: "d84cf1b4-06cb-4c4d-8d0f-c459571baade",
          },
        },
        customField2: {
          type: "date",
          value: {
            label: "Option 1",
            value: "option1",
            id: "d84cf1b4-06cb-4c4d-8d0f-c459571baade",
          },
        },
      },
    },
  ];
}

async function main() {
  const workspace = await prisma.workspace.create({
    data: {
      name: "Workspace 1",
      customFieldDefinition: CUSTOM_FIELD_DEFINITION as any,
    },
  });

  if (!workspace.id) {
    throw new Error("Failed to create workspace");
  }

  const SEED_OPPORTUNITIES = getSeedData(workspace.id);
  for (const opportunity of SEED_OPPORTUNITIES) {
    await prisma.opportunity.create({
      data: opportunity,
    });
  }
}

main()
  .catch(async (e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    console.log("done");
    process.exit();
  });
