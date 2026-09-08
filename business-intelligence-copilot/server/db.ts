import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import Database from "better-sqlite3";

const dbPath = path.resolve(process.cwd(), "data/db/business-intelligence-copilot.sqlite");

mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function now(): string {
  return new Date().toISOString();
}

export function createId(prefix: string): string {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

export function initDb(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS search_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      max_results INTEGER NOT NULL,
      status TEXT NOT NULL,
      started_at TEXT NOT NULL,
      finished_at TEXT
    );

    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_id INTEGER NOT NULL,
      dedupe_key TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      maps_url TEXT,
      website_url TEXT,
      phone TEXT,
      address TEXT,
      rating REAL,
      review_count INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (run_id, dedupe_key),
      FOREIGN KEY (run_id) REFERENCES search_runs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS website_signals (
      business_id INTEGER PRIMARY KEY,
      status TEXT NOT NULL,
      final_url TEXT,
      has_ssl INTEGER NOT NULL DEFAULT 0,
      has_contact_form INTEGER NOT NULL DEFAULT 0,
      has_booking_link INTEGER NOT NULL DEFAULT 0,
      has_social_links INTEGER NOT NULL DEFAULT 0,
      has_email INTEGER NOT NULL DEFAULT 0,
      has_phone INTEGER NOT NULL DEFAULT 0,
      has_pricing_page INTEGER NOT NULL DEFAULT 0,
      has_testimonials INTEGER NOT NULL DEFAULT 0,
      has_google_map_embed INTEGER NOT NULL DEFAULT 0,
      contact_page_url TEXT,
      social_links_json TEXT,
      booking_links_json TEXT,
      contact_links_json TEXT,
      services_json TEXT,
      last_error TEXT,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_findings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      code TEXT NOT NULL,
      severity TEXT NOT NULL,
      category TEXT NOT NULL,
      explanation TEXT NOT NULL,
      evidence_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS business_scores (
      business_id INTEGER PRIMARY KEY,
      opportunity_score INTEGER NOT NULL,
      lead_tier TEXT NOT NULL,
      score_breakdown_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_briefs (
      business_id INTEGER PRIMARY KEY,
      summary_markdown TEXT NOT NULL,
      outreach_angle TEXT NOT NULL,
      redesign_focus TEXT NOT NULL,
      homepage_recommendations_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_businesses_run_id ON businesses(run_id);
    CREATE INDEX IF NOT EXISTS idx_audit_findings_business_id ON audit_findings(business_id);
  `);
}
