export type AppConfig = {
  dataDir: string;
  browserProfileDir: string;
  dbPath: string;
  exportsDir: string;
  screenshotsDir: string;
  mapsHeadless: boolean;
  websiteHeadless: boolean;
  delayMinMs: number;
  delayMaxMs: number;
  websiteMaxPages: number;
  navigationTimeoutMs: number;
};
