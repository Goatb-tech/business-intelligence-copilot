import { db, now } from "./db";
import type {
  AiBrief,
  AnalyticsOverview,
  AuditFinding,
  AuditSeverity,
  BusinessDetail,
  BusinessListItem,
  BusinessRecord,
  BusinessScore,
  LeadTier,
  PipelineBusinessInput,
  SearchRunSummary,
  WebsiteSignals,
  WebsiteStatus,
} from "./types";

type SearchRunRow = {
  id: number;
  query: string;
  max_results: number;
  status: string;
  started_at: string;
  finished_at: string | null;
  business_count?: number;
  avg_opportunity_score?: number | null;
};

type BusinessRow = {
  id: number;
  run_id: number;
  dedupe_key: string;
  name: string;
  category: string | null;
  maps_url: string | null;
  website_url: string | null;
  phone: string | null;
  address: string | null;
  rating: number | null;
  review_count: number | null;
  created_at: string;
  updated_at: string;
};

type WebsiteSignalsRow = {
  business_id: number;
  status: WebsiteStatus;
  final_url: string | null;
  has_ssl: number;
  has_contact_form: number;
  has_booking_link: number;
  has_social_links: number;
  has_email: number;
  has_phone: number;
  has_pricing_page: number;
  has_testimonials: number;
  has_google_map_embed: number;
  contact_page_url: string | null;
  social_links_json: string;
  booking_links_json: string;
  contact_links_json: string;
  services_json: string;
  last_error: string | null;
  updated_at: string;
};

type AuditFindingRow = {
  id: number;
  business_id: number;
  code: string;
  severity: AuditSeverity;
  category: string;
  explanation: string;
  evidence_json: string;
  created_at: string;
};

type BusinessScoreRow = {
  business_id: number;
  opportunity_score: number;
  lead_tier: LeadTier;
  score_breakdown_json: string;
  created_at: string;
};

type AiBriefRow = {
  business_id: number;
  summary_markdown: string;
  outreach_angle: string;
  redesign_focus: string;
  homepage_recommendations_json: string;
  created_at: string;
};

type BusinessListRow = BusinessRow & {
  website_status: WebsiteStatus | null;
  has_contact_form: number | null;
  has_booking_link: number | null;
  opportunity_score: number | null;
  lead_tier: LeadTier | null;
};

function toBool(value: number | null | undefined): boolean {
  return value === 1;
}

function mapSearchRun(row: SearchRunRow): SearchRunSummary {
  return {
    id: row.id,
    query: row.query,
    maxResults: row.max_results,
    status: row.status as SearchRunSummary["status"],
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    businessCount: row.business_count ?? 0,
    avgOpportunityScore: Math.round(row.avg_opportunity_score ?? 0),
  };
}

function mapBusiness(row: BusinessRow): BusinessRecord {
  return {
    id: row.id,
    runId: row.run_id,
    dedupeKey: row.dedupe_key,
    name: row.name,
    category: row.category,
    mapsUrl: row.maps_url,
    websiteUrl: row.website_url,
    phone: row.phone,
    address: row.address,
    rating: row.rating,
    reviewCount: row.review_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWebsiteSignals(row: WebsiteSignalsRow): WebsiteSignals {
  return {
    businessId: row.business_id,
    status: row.status,
    finalUrl: row.final_url,
    hasSsl: toBool(row.has_ssl),
    hasContactForm: toBool(row.has_contact_form),
    hasBookingLink: toBool(row.has_booking_link),
    hasSocialLinks: toBool(row.has_social_links),
    hasEmail: toBool(row.has_email),
    hasPhone: toBool(row.has_phone),
    hasPricingPage: toBool(row.has_pricing_page),
    hasTestimonials: toBool(row.has_testimonials),
    hasGoogleMapEmbed: toBool(row.has_google_map_embed),
    contactPageUrl: row.contact_page_url,
    socialLinks: JSON.parse(row.social_links_json || "[]") as string[],
    bookingLinks: JSON.parse(row.booking_links_json || "[]") as string[],
    contactLinks: JSON.parse(row.contact_links_json || "[]") as string[],
    services: JSON.parse(row.services_json || "[]") as string[],
    lastError: row.last_error,
    updatedAt: row.updated_at,
  };
}

function mapAuditFinding(row: AuditFindingRow): AuditFinding {
  return {
    id: row.id,
    businessId: row.business_id,
    code: row.code,
    severity: row.severity,
    category: row.category,
    explanation: row.explanation,
    evidence: JSON.parse(row.evidence_json) as string[],
    createdAt: row.created_at,
  };
}

function mapScore(row: BusinessScoreRow): BusinessScore {
  return {
    businessId: row.business_id,
    opportunityScore: row.opportunity_score,
    leadTier: row.lead_tier,
    scoreBreakdown: JSON.parse(row.score_breakdown_json) as Array<{ label: string; points: number }>,
    createdAt: row.created_at,
  };
}

function mapAiBrief(row: AiBriefRow): AiBrief {
  return {
    businessId: row.business_id,
    summaryMarkdown: row.summary_markdown,
    outreachAngle: row.outreach_angle,
    redesignFocus: row.redesign_focus,
    homepageRecommendations: JSON.parse(row.homepage_recommendations_json) as string[],
    createdAt: row.created_at,
  };
}

function getPrimaryIssue(businessId: number): string | null {
  const row = db
    .prepare(
      `SELECT code
       FROM audit_findings
       WHERE business_id = ?
       ORDER BY CASE severity WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END DESC, id ASC
       LIMIT 1`,
    )
    .get(businessId) as { code: string } | undefined;

  return row?.code ?? null;
}

export function createSearchRun(query: string, maxResults: number): number {
  const result = db
    .prepare(
      `INSERT INTO search_runs (query, max_results, status, started_at)
       VALUES (?, ?, 'running', ?)`,
    )
    .run(query, maxResults, now());

  return Number(result.lastInsertRowid);
}

export function finishSearchRun(id: number, status: SearchRunSummary["status"]): void {
  db.prepare(`UPDATE search_runs SET status = ?, finished_at = ? WHERE id = ?`).run(status, now(), id);
}

export function listRuns(limit = 10): SearchRunSummary[] {
  const rows = db
    .prepare(
      `SELECT sr.*, COUNT(b.id) AS business_count, AVG(bs.opportunity_score) AS avg_opportunity_score
       FROM search_runs sr
       LEFT JOIN businesses b ON b.run_id = sr.id
       LEFT JOIN business_scores bs ON bs.business_id = b.id
       GROUP BY sr.id
       ORDER BY sr.id DESC
       LIMIT ?`,
    )
    .all(limit) as SearchRunRow[];

  return rows.map(mapSearchRun);
}

export function getRunSummary(runId: number): SearchRunSummary | null {
  const row = db
    .prepare(
      `SELECT sr.*, COUNT(b.id) AS business_count, AVG(bs.opportunity_score) AS avg_opportunity_score
       FROM search_runs sr
       LEFT JOIN businesses b ON b.run_id = sr.id
       LEFT JOIN business_scores bs ON bs.business_id = b.id
       WHERE sr.id = ?
       GROUP BY sr.id`,
    )
    .get(runId) as SearchRunRow | undefined;

  return row ? mapSearchRun(row) : null;
}

export function insertBusiness(runId: number, input: PipelineBusinessInput): BusinessRecord {
  const dedupeKey = `${input.name.toLowerCase()}|${(input.address || "").toLowerCase()}`;
  const timestamp = now();

  const result = db
    .prepare(
      `INSERT INTO businesses (
          run_id, dedupe_key, name, category, maps_url, website_url, phone, address, rating, review_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      runId,
      dedupeKey,
      input.name,
      input.category,
      input.mapsUrl,
      input.websiteUrl,
      input.phone,
      input.address,
      input.rating,
      input.reviewCount,
      timestamp,
      timestamp,
    );

  const row = db.prepare(`SELECT * FROM businesses WHERE id = ?`).get(result.lastInsertRowid) as BusinessRow;
  return mapBusiness(row);
}

export function replaceWebsiteSignals(signals: Omit<WebsiteSignals, "updatedAt">): WebsiteSignals {
  const updatedAt = now();
  db.prepare(`DELETE FROM website_signals WHERE business_id = ?`).run(signals.businessId);
  db.prepare(
    `INSERT INTO website_signals (
       business_id, status, final_url, has_ssl, has_contact_form, has_booking_link, has_social_links,
       has_email, has_phone, has_pricing_page, has_testimonials, has_google_map_embed,
       contact_page_url, social_links_json, booking_links_json, contact_links_json, services_json, last_error, updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    signals.businessId,
    signals.status,
    signals.finalUrl,
    signals.hasSsl ? 1 : 0,
    signals.hasContactForm ? 1 : 0,
    signals.hasBookingLink ? 1 : 0,
    signals.hasSocialLinks ? 1 : 0,
    signals.hasEmail ? 1 : 0,
    signals.hasPhone ? 1 : 0,
    signals.hasPricingPage ? 1 : 0,
    signals.hasTestimonials ? 1 : 0,
    signals.hasGoogleMapEmbed ? 1 : 0,
    signals.contactPageUrl,
    JSON.stringify(signals.socialLinks),
    JSON.stringify(signals.bookingLinks),
    JSON.stringify(signals.contactLinks),
    JSON.stringify(signals.services),
    signals.lastError,
    updatedAt,
  );

  const row = db.prepare(`SELECT * FROM website_signals WHERE business_id = ?`).get(signals.businessId) as WebsiteSignalsRow;
  return mapWebsiteSignals(row);
}

export function replaceAuditFindings(
  businessId: number,
  findings: Array<Omit<AuditFinding, "id" | "businessId" | "createdAt">>,
): AuditFinding[] {
  db.prepare(`DELETE FROM audit_findings WHERE business_id = ?`).run(businessId);
  const insert = db.prepare(
    `INSERT INTO audit_findings (business_id, code, severity, category, explanation, evidence_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const createdAt = now();

  for (const finding of findings) {
    insert.run(businessId, finding.code, finding.severity, finding.category, finding.explanation, JSON.stringify(finding.evidence), createdAt);
  }

  return getAuditFindingsForBusiness(businessId);
}

export function replaceBusinessScore(score: Omit<BusinessScore, "createdAt">): BusinessScore {
  const createdAt = now();
  db.prepare(`DELETE FROM business_scores WHERE business_id = ?`).run(score.businessId);
  db.prepare(
    `INSERT INTO business_scores (business_id, opportunity_score, lead_tier, score_breakdown_json, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(score.businessId, score.opportunityScore, score.leadTier, JSON.stringify(score.scoreBreakdown), createdAt);

  const row = db.prepare(`SELECT * FROM business_scores WHERE business_id = ?`).get(score.businessId) as BusinessScoreRow;
  return mapScore(row);
}

export function replaceAiBrief(brief: Omit<AiBrief, "createdAt">): AiBrief {
  const createdAt = now();
  db.prepare(`DELETE FROM ai_briefs WHERE business_id = ?`).run(brief.businessId);
  db.prepare(
    `INSERT INTO ai_briefs (business_id, summary_markdown, outreach_angle, redesign_focus, homepage_recommendations_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    brief.businessId,
    brief.summaryMarkdown,
    brief.outreachAngle,
    brief.redesignFocus,
    JSON.stringify(brief.homepageRecommendations),
    createdAt,
  );

  const row = db.prepare(`SELECT * FROM ai_briefs WHERE business_id = ?`).get(brief.businessId) as AiBriefRow;
  return mapAiBrief(row);
}

export function listBusinesses(options: { runId?: number; search?: string } = {}): BusinessListItem[] {
  const conditions: string[] = [];
  const params: Record<string, number | string> = {};

  if (options.runId) {
    conditions.push("b.run_id = @runId");
    params.runId = options.runId;
  }

  if (options.search) {
    conditions.push("(b.name LIKE @search OR COALESCE(b.category, '') LIKE @search OR COALESCE(b.address, '') LIKE @search)");
    params.search = `%${options.search}%`;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = db
    .prepare(
      `SELECT
         b.*,
         ws.status AS website_status,
         ws.has_contact_form,
         ws.has_booking_link,
         bs.opportunity_score,
         bs.lead_tier
       FROM businesses b
       LEFT JOIN website_signals ws ON ws.business_id = b.id
       LEFT JOIN business_scores bs ON bs.business_id = b.id
       ${whereClause}
       ORDER BY COALESCE(bs.opportunity_score, 0) DESC, COALESCE(b.review_count, 0) DESC, b.id DESC`,
    )
    .all(params) as BusinessListRow[];

  return rows.map((row) => ({
    ...mapBusiness(row),
    websiteStatus: row.website_status,
    hasContactForm: toBool(row.has_contact_form),
    hasBookingLink: toBool(row.has_booking_link),
    opportunityScore: row.opportunity_score ?? 0,
    leadTier: row.lead_tier,
    primaryIssue: getPrimaryIssue(row.id),
  }));
}

export function getAuditFindingsForBusiness(businessId: number): AuditFinding[] {
  const rows = db
    .prepare(`SELECT * FROM audit_findings WHERE business_id = ? ORDER BY CASE severity WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END DESC, id ASC`)
    .all(businessId) as AuditFindingRow[];

  return rows.map(mapAuditFinding);
}

export function getBusinessDetail(businessId: number): BusinessDetail | null {
  const businessRow = db.prepare(`SELECT * FROM businesses WHERE id = ?`).get(businessId) as BusinessRow | undefined;
  if (!businessRow) {
    return null;
  }

  const websiteSignalsRow = db.prepare(`SELECT * FROM website_signals WHERE business_id = ?`).get(businessId) as WebsiteSignalsRow | undefined;
  const scoreRow = db.prepare(`SELECT * FROM business_scores WHERE business_id = ?`).get(businessId) as BusinessScoreRow | undefined;
  const briefRow = db.prepare(`SELECT * FROM ai_briefs WHERE business_id = ?`).get(businessId) as AiBriefRow | undefined;

  return {
    business: mapBusiness(businessRow),
    websiteSignals: websiteSignalsRow ? mapWebsiteSignals(websiteSignalsRow) : null,
    auditFindings: getAuditFindingsForBusiness(businessId),
    score: scoreRow ? mapScore(scoreRow) : null,
    brief: briefRow ? mapAiBrief(briefRow) : null,
  };
}

export function getOverview(runId?: number): AnalyticsOverview {
  const runCondition = runId ? "WHERE b.run_id = @runId" : "";
  const joinCondition = runId ? "WHERE run_id = @runId" : "";
  const params = runId ? { runId } : {};

  const totals = db
    .prepare(
      `SELECT
         COUNT(b.id) AS total_businesses,
         AVG(bs.opportunity_score) AS avg_opportunity_score,
         SUM(CASE WHEN bs.lead_tier = 'high' THEN 1 ELSE 0 END) AS high_priority_businesses,
         SUM(CASE WHEN ws.status = 'ok' THEN 1 ELSE 0 END) AS websites_reachable
       FROM businesses b
       LEFT JOIN business_scores bs ON bs.business_id = b.id
       LEFT JOIN website_signals ws ON ws.business_id = b.id
       ${runCondition}`,
    )
    .get(params) as {
    total_businesses: number;
    avg_opportunity_score: number | null;
    high_priority_businesses: number | null;
    websites_reachable: number | null;
  };

  const scoreRows = db
    .prepare(
      `SELECT
         CASE
           WHEN opportunity_score >= 75 THEN '75-100'
           WHEN opportunity_score >= 50 THEN '50-74'
           WHEN opportunity_score >= 25 THEN '25-49'
           ELSE '0-24'
         END AS bucket,
         COUNT(*) AS count
       FROM business_scores bs
       INNER JOIN businesses b ON b.id = bs.business_id
       ${runCondition}
       GROUP BY bucket
       ORDER BY bucket ASC`,
    )
    .all(params) as Array<{ bucket: string; count: number }>;

  const issueRows = db
    .prepare(
      `SELECT af.code AS code, COUNT(*) AS count
       FROM audit_findings af
       INNER JOIN businesses b ON b.id = af.business_id
       ${runCondition}
       GROUP BY af.code
       ORDER BY count DESC, af.code ASC
       LIMIT 6`,
    )
    .all(params) as Array<{ code: string; count: number }>;

  return {
    totalBusinesses: totals.total_businesses ?? 0,
    highPriorityBusinesses: totals.high_priority_businesses ?? 0,
    avgOpportunityScore: Math.round(totals.avg_opportunity_score ?? 0),
    websitesReachable: totals.websites_reachable ?? 0,
    recentRuns: listRuns(5),
    scoreDistribution: ["0-24", "25-49", "50-74", "75-100"].map((label) => ({
      label,
      count: scoreRows.find((row) => row.bucket === label)?.count ?? 0,
    })),
    commonIssues: issueRows.map((row) => ({
      code: row.code,
      label: row.code.replaceAll("_", " "),
      count: row.count,
    })),
  };
}
