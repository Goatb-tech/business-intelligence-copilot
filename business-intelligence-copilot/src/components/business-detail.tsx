import type { BusinessDetail as BusinessDetailType } from "../lib/types";
import { AuditList } from "./audit-list";
import { ScoreBadge } from "./score-badge";

export function BusinessDetail({ business }: { business: BusinessDetailType | null }) {
  if (!business) {
    return (
      <section className="panel-noir rounded-[30px] border-dashed p-8 text-center text-slate-400">
        Select a business to inspect its score, findings, and brief.
      </section>
    );
  }

  return (
    <section className="panel-noir space-y-6 rounded-[30px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Business detail</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-white">{business.business.name}</h2>
          <p className="mt-2 text-sm text-slate-400">{business.business.address ?? "No address provided"}</p>
        </div>
        <ScoreBadge tier={business.score?.leadTier ?? null} score={business.score?.opportunityScore ?? 0} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-white/10 bg-black/25 p-4">
          <p className="eyebrow">Signals</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li>Website status: {business.websiteSignals?.status ?? "unknown"}</li>
            <li>Contact form: {business.websiteSignals?.hasContactForm ? "yes" : "no"}</li>
            <li>Booking link: {business.websiteSignals?.hasBookingLink ? "yes" : "no"}</li>
            <li>Testimonials: {business.websiteSignals?.hasTestimonials ? "yes" : "no"}</li>
            <li>Pricing page: {business.websiteSignals?.hasPricingPage ? "yes" : "no"}</li>
          </ul>
        </article>

        <article className="rounded-[24px] border border-white/10 bg-black/25 p-4">
          <p className="eyebrow">Score breakdown</p>
          <div className="mt-3 space-y-2 text-sm text-slate-200">
            {business.score?.scoreBreakdown.map((item) => (
              <div key={`${item.label}-${item.points}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-3 py-2">
                <span>{item.label}</span>
                <span className={item.points >= 0 ? "text-red-200" : "text-slate-500"}>
                  {item.points > 0 ? "+" : ""}
                  {item.points}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>

      {business.brief ? (
        <article className="rounded-[24px] border border-red-400/20 bg-red-500/[0.08] p-4">
          <p className="eyebrow">AI brief</p>
          <div className="mt-3 whitespace-pre-wrap text-sm text-slate-100">{business.brief.summaryMarkdown}</div>
          <p className="mt-4 text-sm text-slate-200">
            <span className="font-semibold text-white">Outreach angle:</span> {business.brief.outreachAngle}
          </p>
          <p className="mt-2 text-sm text-slate-200">
            <span className="font-semibold text-white">Redesign focus:</span> {business.brief.redesignFocus}
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-200">
            {business.brief.homepageRecommendations.map((recommendation) => (
              <li key={recommendation}>{recommendation}</li>
            ))}
          </ul>
        </article>
      ) : null}

      <div>
        <p className="eyebrow mb-3">Audit findings</p>
        <AuditList findings={business.auditFindings} />
      </div>
    </section>
  );
}
