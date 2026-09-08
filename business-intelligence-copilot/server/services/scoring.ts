import type { AuditFinding, BusinessRecord, BusinessScore, LeadTier, WebsiteSignals } from "../types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function leadTierForScore(score: number): LeadTier {
  if (score >= 75) {
    return "high";
  }

  if (score >= 50) {
    return "medium";
  }

  return "low";
}

export function scoreBusiness(input: {
  business: BusinessRecord;
  websiteSignals: WebsiteSignals | null;
  auditFindings: AuditFinding[];
}): Omit<BusinessScore, "createdAt"> {
  const breakdown: Array<{ label: string; points: number }> = [];
  let score = 18;

  if (!input.business.websiteUrl) {
    score += 24;
    breakdown.push({ label: "No website present", points: 24 });
  }

  const reviewCount = input.business.reviewCount ?? 0;
  if (reviewCount >= 150) {
    score += 16;
    breakdown.push({ label: "Established business with strong review volume", points: 16 });
  } else if (reviewCount >= 50) {
    score += 10;
    breakdown.push({ label: "Solid review history", points: 10 });
  }

  const rating = input.business.rating ?? 0;
  if (rating >= 4.5) {
    score += 10;
    breakdown.push({ label: "Strong rating means better upside from a better site", points: 10 });
  } else if (rating >= 4) {
    score += 6;
    breakdown.push({ label: "Healthy rating", points: 6 });
  }

  for (const finding of input.auditFindings) {
    const points = finding.severity === "high" ? 12 : finding.severity === "medium" ? 7 : 3;
    score += points;
    breakdown.push({ label: finding.code.replaceAll("_", " "), points });
  }

  if (input.websiteSignals?.hasBookingLink) {
    score -= 6;
    breakdown.push({ label: "Booking flow already exists", points: -6 });
  }

  if (input.websiteSignals?.hasContactForm) {
    score -= 4;
    breakdown.push({ label: "Contact form already exists", points: -4 });
  }

  if (input.websiteSignals?.hasTestimonials) {
    score -= 5;
    breakdown.push({ label: "Testimonials already visible", points: -5 });
  }

  const opportunityScore = clamp(Math.round(score), 0, 100);

  return {
    businessId: input.business.id,
    opportunityScore,
    leadTier: leadTierForScore(opportunityScore),
    scoreBreakdown: breakdown,
  };
}
