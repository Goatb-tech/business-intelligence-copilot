import type { SearchRunSummary } from "../lib/types";

export function RunStatus({
  runs,
  selectedRunId,
  onSelect,
}: {
  runs: SearchRunSummary[];
  selectedRunId?: number;
  onSelect: (runId?: number) => void;
}) {
  return (
    <section className="panel-noir rounded-[30px] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Runs</p>
          <h2 className="font-display mt-2 text-2xl font-semibold text-white">Recent search runs</h2>
        </div>
        <button className="button-ghost rounded-full px-3 py-1.5 text-xs" onClick={() => onSelect(undefined)} type="button">
          All runs
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {runs.map((run) => {
          const active = run.id === selectedRunId;

          return (
            <button
              key={run.id}
              className={`panel-noir rounded-[24px] p-4 text-left transition ${active ? "border-red-400/45 bg-red-500/10" : "bg-black/30"}`}
              onClick={() => onSelect(run.id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-base font-semibold text-white">{run.query}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{run.status}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                  Run #{run.id}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/8 bg-black/25 px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Leads</p>
                  <p className="mt-2 text-xl font-semibold text-white">{run.businessCount}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-black/25 px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Avg score</p>
                  <p className="mt-2 text-xl font-semibold text-white">{run.avgOpportunityScore}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
