import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { AnalyticsOverview } from "../lib/types";

export function AnalyticsCharts({ overview }: { overview: AnalyticsOverview | null }) {
  if (!overview) {
    return null;
  }

  const issueColors = ["#ef233c", "#fb7185", "#f97316", "#fbbf24", "#7f1d1d", "#475569"];

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <article className="panel-noir rounded-[30px] p-5">
        <p className="eyebrow">Analytics</p>
        <h2 className="font-display mt-2 text-2xl font-semibold text-white">Score distribution</h2>
        <div className="mt-5 h-72">
          <ResponsiveContainer>
            <BarChart data={overview.scoreDistribution}>
              <defs>
                <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef233c" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis allowDecimals={false} stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#090405", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px" }} />
              <Bar dataKey="count" fill="url(#barGlow)" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="panel-noir rounded-[30px] p-5">
        <p className="eyebrow">Patterns</p>
        <h2 className="font-display mt-2 text-2xl font-semibold text-white">Most common issues</h2>
        <div className="mt-5 h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={overview.commonIssues} dataKey="count" nameKey="label" outerRadius={95} innerRadius={42} paddingAngle={4}>
                {overview.commonIssues.map((issue, index) => (
                  <Cell key={issue.code} fill={issueColors[index % issueColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#090405", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
          {overview.commonIssues.map((issue) => (
            <span key={issue.code} className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 uppercase tracking-[0.18em]">
              {issue.label} · {issue.count}
            </span>
          ))}
        </div>
      </article>
    </section>
  );
}
