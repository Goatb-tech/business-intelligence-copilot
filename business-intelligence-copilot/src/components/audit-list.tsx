import type { AuditFinding } from "../lib/types";

const severityStyles = {
  high: "border-red-400/20 bg-red-500/10 text-red-100",
  medium: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  low: "border-white/10 bg-white/[0.03] text-slate-200",
};

export function AuditList({ findings }: { findings: AuditFinding[] }) {
  return (
    <div className="space-y-3">
      {findings.map((finding) => (
        <article key={finding.id} className={`rounded-[24px] border p-4 ${severityStyles[finding.severity]}`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-sm font-semibold">{finding.code.replaceAll("_", " ")}</h3>
            <span className="text-xs uppercase tracking-[0.24em]">{finding.severity}</span>
          </div>
          <p className="mt-2 text-sm opacity-90">{finding.explanation}</p>
          <p className="mt-2 text-xs opacity-75">Evidence: {finding.evidence.join(" · ")}</p>
        </article>
      ))}
    </div>
  );
}
