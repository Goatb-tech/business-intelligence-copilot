import type { BusinessListItem } from "../lib/types";
import { ScoreBadge } from "./score-badge";

export function BusinessesTable({
  businesses,
  selectedBusinessId,
  onSelect,
}: {
  businesses: BusinessListItem[];
  selectedBusinessId?: number;
  onSelect: (businessId: number) => void;
}) {
  return (
    <section className="panel-noir rounded-[30px] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Leads</p>
          <h2 className="font-display mt-2 text-2xl font-semibold text-white">Opportunity-ranked businesses</h2>
        </div>
        <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-slate-400">
          {businesses.length} results
        </p>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/30">
        <table className="min-w-full divide-y divide-white/8 text-sm">
          <thead className="bg-white/[0.03] text-left text-[11px] uppercase tracking-[0.22em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Website</th>
              <th className="px-4 py-3">Top issue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {businesses.map((business) => {
              const active = business.id === selectedBusinessId;

              return (
                <tr
                  key={business.id}
                  className={`table-row-hover cursor-pointer ${active ? "bg-red-500/10" : "bg-transparent"}`}
                  onClick={() => onSelect(business.id)}
                >
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-red-400/70" />
                      <div>
                        <p className="font-display text-[15px] font-semibold text-white">{business.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{business.category ?? "Unknown category"}</p>
                        <p className="mt-2 text-xs text-slate-500">{business.address ?? "No address"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <ScoreBadge tier={business.leadTier} score={business.opportunityScore} />
                  </td>
                  <td className="px-4 py-4 align-top text-slate-300">
                    {business.rating?.toFixed(1) ?? "-"}
                    <div className="mt-1 text-xs text-slate-500">{business.reviewCount ?? 0} reviews</div>
                  </td>
                  <td className="px-4 py-4 align-top text-slate-300">{business.websiteStatus ?? "unknown"}</td>
                  <td className="px-4 py-4 align-top text-slate-400">
                    {business.primaryIssue ? (
                      <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-red-200">
                        {business.primaryIssue.replaceAll("_", " ")}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
