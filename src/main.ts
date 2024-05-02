import express from "express";
import { createPrismaClient } from "./create-prisma-client";
import { exportWorkspaceOpportunitiesToCSV } from "./services/opportunities";

const PORT = 4040;

const prisma = createPrismaClient();

const app = express();

app.use(express.json());

app.get("/opportunities/export", async (req, res) => {
  const csv = await exportWorkspaceOpportunitiesToCSV(prisma);

  res.setHeader("Content-Type", "text/csv");
  res.send(csv);
  res.end();
});

app.get("/opportunities/search", async (req, res) => {
  // Implement me!
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
