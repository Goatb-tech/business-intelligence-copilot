import express from "express";
import cors from "cors";
import { ZodError } from "zod";

import { initDb } from "./db";
import { analyticsRouter } from "./routes/analytics";
import { businessesRouter } from "./routes/businesses";
import { runsRouter } from "./routes/runs";

initDb();

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/api/runs", runsRouter);
app.use("/api/businesses", businessesRouter);
app.use("/api/analytics", analyticsRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    response.status(400).json({ error: error.issues[0]?.message ?? "Invalid request" });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Business Intelligence Copilot API running on http://127.0.0.1:${port}`);
});
