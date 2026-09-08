import { Router } from "express";
import { z } from "zod";

import { getRunSummary, listRuns } from "../repository";
import { runSeedPipeline } from "../services/pipeline";

const createRunSchema = z.object({
  query: z.string().trim().min(3),
  limit: z.number().int().min(1).max(30).default(12),
});

export const runsRouter = Router();

runsRouter.get("/", (_request, response) => {
  response.json(listRuns());
});

runsRouter.get("/:id", (request, response) => {
  const runId = Number(request.params.id);
  const run = getRunSummary(runId);

  if (!run) {
    response.status(404).json({ error: "Run not found" });
    return;
  }

  response.json(run);
});

runsRouter.post("/", async (request, response, next) => {
  try {
    const payload = createRunSchema.parse({
      query: request.body?.query,
      limit: Number(request.body?.limit ?? 12),
    });
    const run = await runSeedPipeline(payload.query, payload.limit);
    response.status(201).json(run);
  } catch (error) {
    next(error);
  }
});
