import { ArrowRight, LayoutDashboard, Radar } from "lucide-react";

export function LuminousDashboardCard({ onTryNow }: { onTryNow: () => void }) {
  return (
    <div className="luminous-shell relative mx-auto w-full max-w-[58rem] rounded-[2rem] p-4 text-white">
      <div className="luminous-light-layer absolute inset-0 rounded-[inherit]">
        <div className="luminous-slit" />
        <div className="luminous-beam">
          <div className="beam-min" />
          <div className="beam-mid" />
          <div className="beam-hi" />
        </div>
      </div>

      <div className="relative z-10 grid min-h-[19rem] gap-5 rounded-[1.5rem] border border-white/8 bg-[radial-gradient(circle_at_top,#2e2e2e_0%,#171717_28%,#0f0f10_100%)] p-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:p-7">
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.3rem] border border-white/10 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              <LayoutDashboard className="h-7 w-7 text-white/85" />
            </div>

            <div className="mt-8">
              <p className="eyebrow">Live dashboard</p>
              <h3 className="font-display mt-4 max-w-[12ch] text-3xl font-semibold text-white sm:text-4xl">Enter the operator workspace.</h3>
              <p className="mt-4 max-w-[54ch] text-sm leading-7 text-white/60 sm:text-base">
                Create runs, inspect lead sets, review audit gaps, and see where the strongest business case actually exists.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/50">
              Runs + scoring
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/50">
              Local-first workflow
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between rounded-[1.4rem] border border-white/8 bg-[rgba(0,0,0,0.22)] p-4">
          <div>
            <p className="eyebrow">Open now</p>
            <h4 className="font-display mt-3 text-2xl font-semibold text-white">Ready to jump in.</h4>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Go directly from the landing page into the working dashboard with the same operator flow you already built.
            </p>
          </div>

          <div className="mt-5 rounded-[1.2rem] border border-white/8 bg-black/25 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8">
                <Radar className="h-4 w-4 text-white/80" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-white/90">Rank the best leads</h4>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">Same functionality, elevated presentation</p>
              </div>
            </div>
          </div>

          <button className="luminous-action group mt-5 flex w-full items-center justify-between rounded-[1.2rem] px-4 py-4 text-left" onClick={onTryNow} type="button">
            <span>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-white/45">Open now</span>
              <span className="font-display mt-2 block text-xl font-semibold text-white">Go to dashboard</span>
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
