import { PrismaClient } from "@prisma/client";
import { exportWorkspaceOpportunitiesToCSV } from "./index";
import { createTestClient } from "@src/seed";
import fs from "fs";

describe("Should serialize opportunities to CSV", () => {
  let prisma: PrismaClient;
  beforeAll(async () => {
    try {
      fs.unlinkSync("./testdb.sqlite3");
    } catch (e) {}

    prisma = await createTestClient({
      filepath: "file:../testdb.sqlite3",
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should serialize opportunities to CSV", async () => {
    const workspaceId = 1;
    const csv = await exportWorkspaceOpportunitiesToCSV(prisma, workspaceId);
    expect(csv).toEqual(
      `
Title,Custom Field 1,Custom Field 2
Opportunity 1,Option 1,N/A
Opportunity 2,Option 1,2021-01-01
Opportunity 3,Option 1,2023-01-01
    `.trim()
    );
  });
});
