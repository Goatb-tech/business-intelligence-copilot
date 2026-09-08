import { Router } from "express";

import { getBusinessDetail, listBusinesses } from "../repository";

export const businessesRouter = Router();

businessesRouter.get("/", (request, response) => {
  const runId = request.query.runId ? Number(request.query.runId) : undefined;
  const search = typeof request.query.search === "string" ? request.query.search : undefined;

  response.json(listBusinesses({ runId, search }));
});

businessesRouter.get("/:id", (request, response) => {
  const businessId = Number(request.params.id);
  const business = getBusinessDetail(businessId);

  if (!business) {
    response.status(404).json({ error: "Business not found" });
    return;
  }

  response.json(business);
});
