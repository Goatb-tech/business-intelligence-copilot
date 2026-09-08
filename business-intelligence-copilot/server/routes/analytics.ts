import { Router } from "express";

import { getOverview } from "../repository";

export const analyticsRouter = Router();

analyticsRouter.get("/overview", (request, response) => {
  const runId = request.query.runId ? Number(request.query.runId) : undefined;
  response.json(getOverview(runId));
});
