import express from "express";
import { createPrismaClient } from "./create-prisma-client";
import { exportOpportunitiesToCSV } from "./services/opportunities";

const PORT = 4040;

const prisma = createPrismaClient();

const app = express();

app.use(express.json());

app.get("/opportunities/export", async (req, res) => {
  const { workspace_id: workspaceId } = req.body;

  const csv = await exportOpportunitiesToCSV(prisma, workspaceId);

  res.setHeader("Content-Type", "text/csv");
  res.send(csv);
  res.end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
