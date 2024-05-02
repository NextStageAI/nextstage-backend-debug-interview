import { Prisma, PrismaClient } from "@prisma/client";
import { CustomField } from "@src/types/custom-field";
import child from "child_process";
import { createPrismaClient } from "./create-prisma-client";

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
        label: "Option 2 Changed",
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

function createWorkspaceSeedPrismaArguments(args: {
  workspaceId: number;
}): Prisma.OpportunityCreateArgs["data"][] {
  const { workspaceId } = args;

  return [
    {
      title: "Opportunity 1",
      workspace: { connect: { id: workspaceId } },
      opportunityData: JSON.stringify({
        customField1: {
          type: "multi-dropdown",
          value: {
            label: "Option 1",
            value: "option1",
            id: "d84cf1b4-06cb-4c4d-8d0f-c459571baade",
          },
        },
        dueDate: {
          type: "date",
          value: "2022-10-01",
        },
      }),
    },
    {
      title: "Opportunity 2",
      workspace: { connect: { id: workspaceId } },
      opportunityData: JSON.stringify({
        customField1: {
          type: "multi-dropdown",
          value: {
            label: "Option 2",
            value: "option2",
            id: "610c84b0-e3b7-44ef-895c-0aa33282fa75",
          },
        },
        customField2: {
          type: "date",
          value: "2021-01-01",
        },
      }),
    },
    {
      title: "Opportunity 3",
      workspace: { connect: { id: workspaceId } },
      opportunityData: JSON.stringify({
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
          value: "2023-01-01",
        },
      }),
    },
  ];
}

export async function createTestClient(args?: {
  filepath?: string;
}): Promise<PrismaClient> {
  const filepath = args?.filepath ?? process.env.DATABASE_URL;

  child.execSync("npm run seed-test", {
    cwd: process.cwd(),
    env: {
      ...process.env,
      // This is the env variable that prisma uses for db source
      // See schema.prisma
      DATABASE_URL: filepath,
    },
    stdio: "inherit",

    // 60 seconds to seed.
    timeout: 1000 * 60,
  });

  const client = createPrismaClient({ filepath });
  await seedWorkspace(client);

  return client;
}

export async function seedWorkspace(prisma: PrismaClient) {
  const workspace = await prisma.workspace.create({
    data: {
      name: "Workspace 1",
      customFieldDefinition: JSON.stringify(CUSTOM_FIELD_DEFINITION),
    },
  });

  if (!workspace.id) {
    throw new Error("Failed to create workspace");
  }

  const seedOpportunitiesPrismaArguments = createWorkspaceSeedPrismaArguments({
    workspaceId: workspace.id,
  });

  for (const opportunity of seedOpportunitiesPrismaArguments) {
    await prisma.opportunity.create({
      data: opportunity,
    });
  }
}
