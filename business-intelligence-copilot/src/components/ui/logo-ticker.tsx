import { BarChart3, BriefcaseBusiness, Radar, SearchCheck, Sparkles, Workflow } from "lucide-react";

const items = [
  { label: "Market Search", icon: SearchCheck },
  { label: "Website Audit", icon: Workflow },
  { label: "Opportunity Score", icon: BarChart3 },
  { label: "Business Fit", icon: BriefcaseBusiness },
  { label: "Signal Review", icon: Radar },
  { label: "AI Briefs", icon: Sparkles },
];

function TickerTrack() {
  return (
    <div className="ticker-track flex min-w-max items-center gap-4 py-3">
      {[...items, ...items].map((item, index) => {
        const Icon = item.icon;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-slate-200 backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-200">
              <Icon className="h-4 w-4" />
            </div>
            <span className="uppercase tracking-[0.2em] text-[11px] text-slate-300">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function LogoTicker() {
  return (
    <div className="mask-fade-x overflow-hidden rounded-[26px] border border-white/10 bg-black/25">
      <div className="group flex w-max hover:[&_.ticker-track]:[animation-play-state:paused]">
        <TickerTrack />
      </div>
    </div>
  );
}
