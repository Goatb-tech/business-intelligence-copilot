import { useState } from "react";
import { BarChart3, SearchCheck, Sparkles, Workflow } from "lucide-react";

import { CardSwap, Card } from "./ui/card-swap";
import { InsightMarquee } from "./ui/insight-marquee";
import { LuminousDashboardCard } from "./ui/luminous-dashboard-card";
import { WovenLightHero } from "./ui/woven-light-hero";

const featureCards = [
  {
    title: "Collect local businesses",
    description: "Start with a niche and city, then build a lead set you can actually inspect and work through.",
    icon: SearchCheck,
  },
  {
    title: "Audit the web presence",
    description: "Surface what is missing, weak, or unclear before you ever write a pitch or redesign recommendation.",
    icon: Workflow,
  },
  {
    title: "Rank opportunity",
    description: "Push the most promising businesses to the top using review strength, gaps, and conversion friction.",
    icon: BarChart3,
  },
  {
    title: "Turn findings into action",
    description: "Generate a brief, outreach angle, and redesign focus instead of staring at raw data alone.",
    icon: Sparkles,
  },
];

const workflowSteps = [
  {
    label: "Market search",
    detail: "Choose a market like dentist in Austin and start with a lead set that feels concrete.",
    icon: SearchCheck,
  },
  {
    label: "Signal review",
    detail: "Inspect website gaps, trust signals, and contact friction without digging through scattered notes.",
    icon: Workflow,
  },
  {
    label: "Opportunity rank",
    detail: "Move the strongest leads up using review strength, gaps, and conversion friction in one pass.",
    icon: BarChart3,
  },
  {
    label: "AI brief",
    detail: "Turn the findings into a usable angle, redesign focus, and next step instead of raw data alone.",
    icon: Sparkles,
  },
];

function WorkflowShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeStep = workflowSteps[activeIndex];
  const ActiveIcon = activeStep.icon;

  return (
    <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(239,35,60,0.14),transparent_30%),linear-gradient(180deg,rgba(20,7,9,0.94),rgba(7,3,4,0.96))] p-4 sm:p-5">
      <div className="mask-fade-x overflow-hidden rounded-[2rem] border border-white/8 bg-black/20 px-3 py-3 sm:px-4">
        <div className="flex min-w-full flex-wrap gap-3 lg:flex-nowrap">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeIndex;

            return (
              <button
                key={step.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`flex min-h-[5.75rem] flex-1 items-center gap-4 rounded-[1.6rem] border px-4 py-4 transition duration-500 ${
                  isActive
                    ? "border-red-400/30 bg-red-500/12 shadow-[0_18px_45px_rgba(100,10,20,0.28)]"
                    : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.035]"
                }`}
                aria-pressed={isActive}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition duration-500 ${
                    isActive ? "border-red-300/30 bg-red-500/14 text-red-100" : "border-white/10 bg-white/[0.03] text-slate-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className={`text-[11px] uppercase tracking-[0.24em] ${isActive ? "text-red-100/80" : "text-slate-500"}`}>{`0${index + 1}`}</p>
                  <h3 className={`mt-2 font-display text-lg font-semibold transition duration-500 ${isActive ? "text-white" : "text-slate-300"}`}>
                    {step.label}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="rounded-[2rem] border border-white/8 bg-black/25 p-6 sm:p-7">
          <p className="eyebrow">Connected system</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-300/25 bg-red-500/10 text-red-100">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Active step</p>
              <h3 className="font-display mt-1 text-2xl font-semibold text-white sm:text-3xl">{activeStep.label}</h3>
            </div>
          </div>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">{activeStep.detail}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {workflowSteps.map((step, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={`${step.label}-jump`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition ${
                    isActive
                      ? "border-red-400/30 bg-red-500/12 text-red-100"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/15 hover:text-slate-200"
                  }`}
                  aria-pressed={isActive}
                >
                  {`0${index + 1}`} {step.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage({ onTryNow }: { onTryNow: () => void }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#040203] text-slate-100">
      <WovenLightHero
        brand="Business Intelligence Copilot"
        title="Business Intelligence Copilot"
        subtitle="A local-first intelligence console for discovering local businesses, auditing their web presence, ranking opportunity, and turning findings into usable briefs."
        primaryLabel="Try Now"
        secondaryLabel="See how it works"
        onPrimaryClick={onTryNow}
        onSecondaryClick={() => document.getElementById("overview")?.scrollIntoView({ behavior: "smooth", block: "start" })}
      />

      <main className="relative z-10 -mt-20 px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          <section id="overview" className="panel-noir overflow-hidden rounded-[3rem] px-6 py-8 lg:px-8 lg:py-10">
            <div className="max-w-3xl">
              <p className="eyebrow">What it is</p>
              <h2 className="font-display display-line mt-4 text-4xl font-semibold text-white sm:text-5xl">
                Built for real lead review.
                <span className="block bg-gradient-to-b from-white to-white/45 bg-clip-text text-transparent">Not generic dashboard theater.</span>
              </h2>
              <p className="muted-copy mt-5 max-w-2xl text-base leading-7">
                Business Intelligence Copilot helps you move from raw lead collection to a clearer business case with one visual system for
                search, audit, ranking, and action.
              </p>
            </div>

            <div className="relative mt-8 px-2 pb-2 pt-4 sm:px-4 lg:px-0">
              <div className="relative flex min-h-[24rem] items-center justify-center overflow-visible lg:justify-end">
                <CardSwap
                  width="min(100%, 700px)"
                  height="clamp(280px, 40vw, 430px)"
                  cardDistance={38}
                  verticalDistance={30}
                  delay={4200}
                  pauseOnHover
                  skewAmount={4}
                >
                  {featureCards.map((feature, index) => {
                    const Icon = feature.icon;

                    return (
                      <Card key={feature.title} className="p-0">
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[inherit] border border-white/8 bg-[radial-gradient(circle_at_top_right,rgba(239,35,60,0.2),transparent_28%),linear-gradient(180deg,#1a090d_0%,#090406_100%)]">
                          <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                            <div className="flex items-center justify-between">
                              <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-red-300/20 bg-red-500/10 text-red-200">
                                <Icon className="h-5 w-5" />
                              </div>
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-400">
                                0{index + 1}
                              </span>
                            </div>

                            <div className="max-w-[34rem]">
                              <p className="text-[11px] uppercase tracking-[0.24em] text-red-100/75">Lead review signal</p>
                              <h3 className="font-display mt-3 text-3xl font-semibold text-white sm:text-[2.2rem]">{feature.title}</h3>
                              <p className="mt-4 max-w-[85%] text-sm leading-7 text-slate-300 sm:text-base">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </CardSwap>
              </div>
              <div className="pointer-events-none mt-5 flex justify-center lg:justify-end">
                <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Hover to pause the stack
                </div>
              </div>
            </div>
          </section>

          <section id="workflow" className="panel-noir overflow-hidden rounded-[3rem] px-6 py-8 lg:px-8 lg:py-10">
            <div className="max-w-3xl">
              <p className="eyebrow">How it works</p>
              <h2 className="font-display mt-4 text-4xl font-semibold text-white sm:text-5xl">One workflow from search to decision.</h2>
              <p className="muted-copy mt-5 max-w-2xl text-base leading-7">
                The homepage should read like one connected system: search the market, inspect the signals, rank the opportunity, and turn the
                findings into a next move.
              </p>
            </div>

            <div className="mt-8">
              <WorkflowShowcase />
            </div>
          </section>

          <section className="panel-noir panel-red-glow overflow-hidden rounded-[3rem] px-6 py-8 lg:px-8 lg:py-10">
            <div className="max-w-3xl">
              <p className="eyebrow">Why it matters</p>
              <h2 className="font-display mt-4 text-4xl font-semibold text-white sm:text-5xl">See where the best business case actually is.</h2>
              <p className="muted-copy mt-5 max-w-2xl text-base leading-7">
                Some businesses have obvious friction. Others look established but still leak conversions. The right signal mix tells you what
                matters most and what the copilot should do with it next.
              </p>
            </div>

            <div className="mt-8">
              <InsightMarquee />
            </div>
          </section>

          <section className="pt-2">
            <LuminousDashboardCard onTryNow={onTryNow} />
          </section>
        </div>
      </main>
    </div>
  );
}
