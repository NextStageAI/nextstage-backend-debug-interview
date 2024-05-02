import { PrismaClient } from "@prisma/client";
import { seedWorkspace } from "../src/seed";

async function main() {
  const prisma = new PrismaClient();

  await seedWorkspace(prisma);
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(() => {
    console.log("done");
    process.exit();
  });
