import type { LeadTier } from "../lib/types";

const styles: Record<LeadTier, string> = {
  high: "bg-red-500/15 text-red-200 ring-red-400/25",
  medium: "bg-amber-500/15 text-amber-200 ring-amber-400/25",
  low: "bg-white/8 text-slate-300 ring-white/10",
};

export function ScoreBadge({ tier, score }: { tier: LeadTier | null; score: number }) {
  const resolvedTier = tier ?? "low";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${styles[resolvedTier]}`}>
      {resolvedTier} · {score}
    </span>
  );
}
