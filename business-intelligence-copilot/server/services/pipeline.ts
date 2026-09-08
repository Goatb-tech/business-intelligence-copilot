import { generateBriefWithOllama } from "./ollama";
import { scoreBusiness } from "./scoring";
import {
  createSearchRun,
  finishSearchRun,
  getRunSummary,
  insertBusiness,
  replaceAiBrief,
  replaceAuditFindings,
  replaceBusinessScore,
  replaceWebsiteSignals,
} from "../repository";
import type {
  AuditFinding,
  BusinessRecord,
  PipelineBusinessInput,
  SearchRunSummary,
  WebsiteSignals,
} from "../types";

const prefixes = ["North", "Summit", "Oak", "Blue", "Prime", "Bright", "Metro", "Signal", "River", "Civic"];
const suffixes = ["Studio", "Group", "Partners", "Works", "Center", "Collective", "Experts", "Co.", "Hub", "Pros"];
const streetNames = ["Main", "Peachtree", "Market", "Broad", "Highland", "Maple", "Lake", "Commerce", "Cedar", "Spring"];

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function createRandom(seed: number) {
  let current = seed || 1;
  return () => {
    current = (current * 1664525 + 1013904223) % 4294967296;
    return current / 4294967296;
  };
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function parseQuery(query: string): { niche: string; city: string } {
  const [rawNiche, rawCity] = query.split(/\sin\s/i);
  return {
    niche: titleCase(rawNiche?.trim() || "Local Business"),
    city: titleCase(rawCity?.trim() || "Your City"),
  };
}

function buildBusinessName(niche: string, random: () => number, index: number): string {
  const prefix = prefixes[index % prefixes.length];
  const suffix = suffixes[Math.floor(random() * suffixes.length)] ?? "Studio";
  const nichePart = niche.replace(/s$/i, "");
  return `${prefix} ${nichePart} ${suffix}`;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildBusinesses(query: string, limit: number): PipelineBusinessInput[] {
  const { niche, city } = parseQuery(query);
  const random = createRandom(hashString(query));
  const results: PipelineBusinessInput[] = [];

  for (let index = 0; index < limit; index += 1) {
    const name = buildBusinessName(niche, random, index);
    const hasWebsite = random() > 0.18;
    const rating = Math.round((3.6 + random() * 1.3) * 10) / 10;
    const reviewCount = Math.max(8, Math.round(random() * 320));
    const streetNumber = 120 + Math.round(random() * 780);
    const street = streetNames[Math.floor(random() * streetNames.length)] ?? "Main";

    results.push({
      name,
      category: niche,
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${name} ${city}`)}`,
      websiteUrl: hasWebsite ? `https://${slugify(name)}-${slugify(city)}.com` : null,
      phone: `(555) ${200 + index}-${1000 + index}`,
      address: `${streetNumber} ${street} St, ${city}`,
      rating,
      reviewCount,
    });
  }

  return results;
}

function buildWebsiteSignals(business: BusinessRecord, query: string): Omit<WebsiteSignals, "updatedAt"> {
  const random = createRandom(hashString(`${query}:${business.id}`));
  const services = [
    `Primary ${business.category?.toLowerCase() ?? "service"}`,
    "Appointments",
    "Consultations",
  ];

  if (!business.websiteUrl) {
    return {
      businessId: business.id,
      status: "missing",
      finalUrl: null,
      hasSsl: false,
      hasContactForm: false,
      hasBookingLink: false,
      hasSocialLinks: false,
      hasEmail: false,
      hasPhone: business.phone !== null,
      hasPricingPage: false,
      hasTestimonials: false,
      hasGoogleMapEmbed: false,
      contactPageUrl: null,
      socialLinks: [],
      bookingLinks: [],
      contactLinks: [],
      services,
      lastError: "No website found during initial discovery.",
    };
  }

  const hasBookingLink = random() > 0.45;
  const hasContactForm = random() > 0.35;
  const hasTestimonials = random() > 0.55;
  const hasPricingPage = random() > 0.72;
  const hasMapEmbed = random() > 0.65;
  const hasSocialLinks = random() > 0.42;
  const contactPageUrl = `${business.websiteUrl}/contact`;

  return {
    businessId: business.id,
    status: "ok",
    finalUrl: business.websiteUrl,
    hasSsl: true,
    hasContactForm,
    hasBookingLink,
    hasSocialLinks,
    hasEmail: random() > 0.3,
    hasPhone: true,
    hasPricingPage,
    hasTestimonials,
    hasGoogleMapEmbed: hasMapEmbed,
    contactPageUrl,
    socialLinks: hasSocialLinks ? ["https://instagram.com/example", "https://facebook.com/example"] : [],
    bookingLinks: hasBookingLink ? [`${business.websiteUrl}/book`] : [],
    contactLinks: [contactPageUrl],
    services,
    lastError: null,
  };
}

function buildAuditFindings(business: BusinessRecord, signals: WebsiteSignals | Omit<WebsiteSignals, "updatedAt">): Array<Omit<AuditFinding, "id" | "businessId" | "createdAt">> {
  const findings: Array<Omit<AuditFinding, "id" | "businessId" | "createdAt">> = [];

  if (signals.status === "missing") {
    findings.push({
      code: "missing_website",
      severity: "high",
      category: "presence",
      explanation: "This business appears to have no live website, which limits conversion and discovery.",
      evidence: [business.name, business.address ?? "No address available"],
    });
    return findings;
  }

  if (!signals.hasContactForm) {
    findings.push({
      code: "missing_contact_form",
      severity: "high",
      category: "conversion",
      explanation: "Visitors do not have a clear form-based contact path.",
      evidence: [signals.finalUrl ?? "No final URL"],
    });
  }

  if (!signals.hasBookingLink) {
    findings.push({
      code: "missing_booking_flow",
      severity: "high",
      category: "conversion",
      explanation: "The site does not show an obvious booking or scheduling flow.",
      evidence: [signals.finalUrl ?? "No final URL"],
    });
  }

  if (!signals.hasTestimonials) {
    findings.push({
      code: "missing_social_proof",
      severity: "medium",
      category: "trust",
      explanation: "Testimonials or proof points are not obvious on the website.",
      evidence: [business.name],
    });
  }

  if (!signals.hasPricingPage) {
    findings.push({
      code: "missing_pricing_clarity",
      severity: "medium",
      category: "clarity",
      explanation: "Visitors may not understand price expectations before contacting the business.",
      evidence: [signals.finalUrl ?? "No final URL"],
    });
  }

  if (!signals.hasGoogleMapEmbed) {
    findings.push({
      code: "weak_local_trust_signals",
      severity: "low",
      category: "local_seo",
      explanation: "Location cues and local trust elements look thin.",
      evidence: [business.address ?? "No address available"],
    });
  }

  return findings;
}

function fallbackBrief(input: {
  business: BusinessRecord;
  score: number;
  findings: Array<Omit<AuditFinding, "id" | "businessId" | "createdAt">>;
}): {
  summaryMarkdown: string;
  outreachAngle: string;
  redesignFocus: string;
  homepageRecommendations: string[];
} {
  const findingsText = input.findings.slice(0, 3).map((finding) => finding.code.replaceAll("_", " "));
  return {
    summaryMarkdown: `## ${input.business.name}\n\nThis lead scores **${input.score}/100** because it has visible website and conversion gaps despite meaningful market proof from reviews and rating. The most visible issues are ${findingsText.join(", ") || "limited web presence"}.`,
    outreachAngle: `Lead with a fast conversion uplift pitch: improve trust, reduce friction, and make it easier for ${input.business.name} to turn search traffic into calls or bookings.`,
    redesignFocus: `Focus the redesign on a sharper homepage value proposition, visible trust signals, and one clear primary action.`,
    homepageRecommendations: [
      "Add a stronger hero section with one primary CTA.",
      "Surface testimonials and review proof above the fold.",
      "Make booking or contact action visible on every screen.",
    ],
  };
}

async function createBrief(input: {
  business: BusinessRecord;
  findings: Array<Omit<AuditFinding, "id" | "businessId" | "createdAt">>;
  opportunityScore: number;
}) {
  const fallback = fallbackBrief({
    business: input.business,
    score: input.opportunityScore,
    findings: input.findings,
  });

  const prompt = [
    "You are generating a concise business lead intelligence brief.",
    "Return JSON only with keys: summaryMarkdown, outreachAngle, redesignFocus, homepageRecommendations.",
    `Business: ${input.business.name}`,
    `Category: ${input.business.category ?? "Unknown"}`,
    `Rating: ${input.business.rating ?? "Unknown"}`,
    `Review count: ${input.business.reviewCount ?? 0}`,
    `Opportunity score: ${input.opportunityScore}`,
    `Findings: ${input.findings.map((finding) => `${finding.code}: ${finding.explanation}`).join(" | ")}`,
  ].join("\n");

  const aiResult = await generateBriefWithOllama(prompt);
  return aiResult ?? fallback;
}

export async function runSeedPipeline(query: string, limit: number): Promise<SearchRunSummary> {
  const runId = createSearchRun(query, limit);

  try {
    const leads = buildBusinesses(query, limit);
    for (const lead of leads) {
      const business = insertBusiness(runId, lead);
      const websiteSignals = replaceWebsiteSignals(buildWebsiteSignals(business, query));
      const findings = replaceAuditFindings(business.id, buildAuditFindings(business, websiteSignals));
      const score = replaceBusinessScore(scoreBusiness({ business, websiteSignals, auditFindings: findings }));
      const briefPayload = await createBrief({ business, findings, opportunityScore: score.opportunityScore });

      replaceAiBrief({
        businessId: business.id,
        summaryMarkdown: briefPayload.summaryMarkdown,
        outreachAngle: briefPayload.outreachAngle,
        redesignFocus: briefPayload.redesignFocus,
        homepageRecommendations: briefPayload.homepageRecommendations,
      });
    }

    finishSearchRun(runId, "completed");
    return getRunSummary(runId) ?? {
      id: runId,
      query,
      maxResults: limit,
      status: "completed",
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      businessCount: limit,
      avgOpportunityScore: 0,
    };
  } catch (error) {
    finishSearchRun(runId, "failed");
    throw error;
  }
}
