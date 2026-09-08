import { readFile } from "node:fs/promises";
import path from "node:path";

import type { AppConfig } from "./types";

const defaults: AppConfig = {
  dataDir: "data",
  browserProfileDir: "data/browser-profile",
  dbPath: "data/db/business-intelligence-copilot.sqlite",
  exportsDir: "data/exports",
  screenshotsDir: "data/screenshots",
  mapsHeadless: false,
  websiteHeadless: true,
  delayMinMs: 1200,
  delayMaxMs: 2800,
  websiteMaxPages: 5,
  navigationTimeoutMs: 45000,
};

export async function loadConfig(): Promise<AppConfig> {
  try {
    const raw = await readFile(path.resolve(process.cwd(), "automation.config.json"), "utf8");
    return { ...defaults, ...(JSON.parse(raw) as Partial<AppConfig>) };
  } catch {
    return defaults;
  }
}
