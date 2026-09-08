export type RunStatus = "running" | "completed" | "failed";

export type WebsiteStatus = "ok" | "missing" | "unreachable" | "blocked";

export type AuditSeverity = "low" | "medium" | "high";

export type LeadTier = "low" | "medium" | "high";

export type SearchRunSummary = {
  id: number;
  query: string;
  maxResults: number;
  status: RunStatus;
  startedAt: string;
  finishedAt: string | null;
  businessCount: number;
  avgOpportunityScore: number;
};

export type BusinessRecord = {
  id: number;
  runId: number;
  dedupeKey: string;
  name: string;
  category: string | null;
  mapsUrl: string | null;
  websiteUrl: string | null;
  phone: string | null;
  address: string | null;
  rating: number | null;
  reviewCount: number | null;
  createdAt: string;
  updatedAt: string;
};

export type WebsiteSignals = {
  businessId: number;
  status: WebsiteStatus;
  finalUrl: string | null;
  hasSsl: boolean;
  hasContactForm: boolean;
  hasBookingLink: boolean;
  hasSocialLinks: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
  hasPricingPage: boolean;
  hasTestimonials: boolean;
  hasGoogleMapEmbed: boolean;
  contactPageUrl: string | null;
  socialLinks: string[];
  bookingLinks: string[];
  contactLinks: string[];
  services: string[];
  lastError: string | null;
  updatedAt: string;
};

export type AuditFinding = {
  id: number;
  businessId: number;
  code: string;
  severity: AuditSeverity;
  category: string;
  explanation: string;
  evidence: string[];
  createdAt: string;
};

export type BusinessScore = {
  businessId: number;
  opportunityScore: number;
  leadTier: LeadTier;
  scoreBreakdown: Array<{ label: string; points: number }>;
  createdAt: string;
};

export type AiBrief = {
  businessId: number;
  summaryMarkdown: string;
  outreachAngle: string;
  redesignFocus: string;
  homepageRecommendations: string[];
  createdAt: string;
};

export type BusinessListItem = BusinessRecord & {
  websiteStatus: WebsiteStatus | null;
  hasContactForm: boolean;
  hasBookingLink: boolean;
  opportunityScore: number;
  leadTier: LeadTier | null;
  primaryIssue: string | null;
};

export type BusinessDetail = {
  business: BusinessRecord;
  websiteSignals: WebsiteSignals | null;
  auditFindings: AuditFinding[];
  score: BusinessScore | null;
  brief: AiBrief | null;
};

export type AnalyticsOverview = {
  totalBusinesses: number;
  highPriorityBusinesses: number;
  avgOpportunityScore: number;
  websitesReachable: number;
  recentRuns: SearchRunSummary[];
  scoreDistribution: Array<{ label: string; count: number }>;
  commonIssues: Array<{ code: string; label: string; count: number }>;
};

export type PipelineBusinessInput = {
  name: string;
  category: string;
  mapsUrl: string | null;
  websiteUrl: string | null;
  phone: string | null;
  address: string;
  rating: number;
  reviewCount: number;
};
