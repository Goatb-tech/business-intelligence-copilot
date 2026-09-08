import { useDeferredValue, useState } from "react";
import { ArrowLeft, LayoutDashboard, Radar } from "lucide-react";

import { AnalyticsCharts } from "./analytics-charts";
import { BusinessDetail } from "./business-detail";
import { BusinessesTable } from "./businesses-table";
import { RunStatus } from "./run-status";
import { SearchForm } from "./search-form";
import { useDashboardData } from "../hooks/use-dashboard-data";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="panel-noir metric-card rounded-[28px] p-5">
      <p className="eyebrow">{label}</p>
      <p className="font-display mt-4 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">Live from your current local lead intelligence layer.</p>
    </article>
  );
}

export function DashboardExperience({ onBackHome }: { onBackHome: () => void }) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const dashboard = useDashboardData(deferredSearch);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#040203] text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,35,60,0.14),transparent_24%),linear-gradient(180deg,#130406_0%,#040203_22%,#040203_100%)]" />
        <div className="bg-stars-small" />
        <div className="absolute inset-0 bg-grid-mask opacity-40" />
      </div>

      <div className="gradient-blur-top" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="sticky top-5 z-20">
          <div className="panel-noir flex flex-col gap-4 rounded-[28px] px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <button className="button-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm" onClick={onBackHome} type="button">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </button>
              <div>
                <p className="eyebrow">Live workspace</p>
                <h1 className="font-display mt-2 text-2xl font-semibold text-white">Business Intelligence Copilot Dashboard</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                <LayoutDashboard className="mr-1 inline h-3.5 w-3.5" />
                Dashboard
              </span>
              <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-red-200">
                <Radar className="mr-1 inline h-3.5 w-3.5" />
                Runs + scoring
              </span>
            </div>
          </div>
        </header>

        <section className="panel-noir rounded-[36px] px-6 py-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="eyebrow">Operator mode</p>
              <h2 className="font-display display-line mt-4 text-4xl font-semibold text-white sm:text-5xl">
                Search a market.
                <span className="block bg-gradient-to-b from-white to-white/45 bg-clip-text text-transparent">Rank who needs help most.</span>
              </h2>
              <p className="muted-copy mt-5 max-w-2xl text-base leading-7">
                The workflow is unchanged: create a run, inspect the lead set, click into a business, and review opportunity score, audit
                issues, and brief output.
              </p>
            </div>
            <div className="panel-noir rounded-[28px] p-2">
              <div className="rounded-[24px] border border-white/6 bg-black/35 p-5">
                <p className="eyebrow">Try now</p>
                <h3 className="font-display mt-2 text-xl font-semibold text-white">Launch a fresh run</h3>
                <div className="mt-4">
                  <SearchForm onSubmit={dashboard.createSearchRun} isSubmitting={dashboard.isCreatingRun} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {dashboard.error ? (
          <div className="panel-noir rounded-2xl border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">{dashboard.error}</div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total businesses" value={dashboard.overview?.totalBusinesses ?? 0} />
          <StatCard label="High priority" value={dashboard.overview?.highPriorityBusinesses ?? 0} />
          <StatCard label="Avg opportunity" value={dashboard.overview?.avgOpportunityScore ?? 0} />
          <StatCard label="Reachable websites" value={dashboard.overview?.websitesReachable ?? 0} />
        </section>

        <RunStatus runs={dashboard.runs} selectedRunId={dashboard.selectedRunId} onSelect={dashboard.selectRun} />

        <section className="panel-noir rounded-[30px] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Filter</p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-white">Search inside the current lead set</h2>
            </div>
            <input
              className="input-noir w-full rounded-full px-5 py-3 text-sm sm:max-w-md"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by business, category, or address"
            />
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <BusinessesTable
            businesses={dashboard.businesses}
            selectedBusinessId={dashboard.selectedBusinessId}
            onSelect={dashboard.selectBusiness}
          />
          <BusinessDetail business={dashboard.selectedBusiness} />
        </div>

        <AnalyticsCharts overview={dashboard.overview} />

        {dashboard.isLoading ? <p className="text-sm text-slate-500">Refreshing dashboard data...</p> : null}
      </div>
    </div>
  );
}
