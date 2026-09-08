import { describe, expect, it } from "vitest";

import { scoreBusiness } from "../server/services/scoring";
import type { AuditFinding, BusinessRecord, WebsiteSignals } from "../server/types";

function createBusiness(overrides: Partial<BusinessRecord> = {}): BusinessRecord {
  return {
    id: 1,
    runId: 1,
    dedupeKey: "demo",
    name: "Demo Dental Studio",
    category: "Dentist",
    mapsUrl: null,
    websiteUrl: "https://demo-dental.com",
    phone: "555-0101",
    address: "123 Main St",
    rating: 4.7,
    reviewCount: 180,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createSignals(overrides: Partial<WebsiteSignals> = {}): WebsiteSignals {
  return {
    businessId: 1,
    status: "ok",
    finalUrl: "https://demo-dental.com",
    hasSsl: true,
    hasContactForm: false,
    hasBookingLink: false,
    hasSocialLinks: false,
    hasEmail: true,
    hasPhone: true,
    hasPricingPage: false,
    hasTestimonials: false,
    hasGoogleMapEmbed: false,
    contactPageUrl: "/contact",
    socialLinks: [],
    bookingLinks: [],
    contactLinks: [],
    services: ["cleanings"],
    lastError: null,
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createFinding(code: string, severity: AuditFinding["severity"]): AuditFinding {
  return {
    id: Math.random(),
    businessId: 1,
    code,
    severity,
    category: "conversion",
    explanation: code,
    evidence: [],
    createdAt: new Date().toISOString(),
  };
}

describe("scoreBusiness", () => {
  it("raises opportunity score when a well-reviewed business has major website gaps", () => {
    const score = scoreBusiness({
      business: createBusiness(),
      websiteSignals: createSignals(),
      auditFindings: [createFinding("missing_contact_form", "high"), createFinding("missing_booking_flow", "high")],
    });

    expect(score.opportunityScore).toBeGreaterThanOrEqual(55);
    expect(score.leadTier).toBe("medium");
  });

  it("keeps score lower when conversion basics already exist", () => {
    const score = scoreBusiness({
      business: createBusiness(),
      websiteSignals: createSignals({
        hasContactForm: true,
        hasBookingLink: true,
        hasTestimonials: true,
      }),
      auditFindings: [],
    });

    expect(score.opportunityScore).toBeLessThan(45);
    expect(score.leadTier).toBe("low");
  });
});
