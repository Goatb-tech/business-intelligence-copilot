import { AlertTriangle, ArrowUpRight, BadgeCheck, CalendarClock, Layers3, MessageSquareText, Sparkles, Target } from "lucide-react";

const problemCards = [
  {
    title: "Strong reviews, weak conversion",
    body: "A business can already have trust in the market while still losing calls because the site is unclear.",
    icon: BadgeCheck,
    accent: "from-emerald-500/18 via-emerald-500/6 to-transparent",
  },
  {
    title: "Missing booking path",
    body: "If users cannot book fast, even good traffic turns into friction instead of appointments.",
    icon: CalendarClock,
    accent: "from-red-500/20 via-red-500/6 to-transparent",
  },
  {
    title: "Unclear pricing cues",
    body: "When price expectations stay fuzzy, interested visitors hesitate instead of moving toward contact.",
    icon: Layers3,
    accent: "from-amber-500/18 via-amber-500/6 to-transparent",
  },
  {
    title: "Weak local trust signals",
    body: "Thin proof, weak contact access, and limited service clarity often create the strongest redesign case.",
    icon: AlertTriangle,
    accent: "from-fuchsia-500/16 via-fuchsia-500/5 to-transparent",
  },
];

const solutionCards = [
  {
    title: "Decision support, not noise",
    body: "The output should help you decide who is worth helping next and why, not just dump more facts.",
    icon: ArrowUpRight,
    accent: "from-white/12 via-white/4 to-transparent",
  },
  {
    title: "Outreach angle",
    body: "The best pitch comes from the visible business gap, not from generic agency language.",
    icon: MessageSquareText,
    accent: "from-amber-500/18 via-amber-500/6 to-transparent",
  },
  {
    title: "Redesign focus",
    body: "The copilot should name the one or two page changes that unlock the clearest conversion lift.",
    icon: Sparkles,
    accent: "from-red-500/20 via-red-500/6 to-transparent",
  },
  {
    title: "Priority reasoning",
    body: "Rank the next best lead with context from review strength, friction, and business fit in one read.",
    icon: Target,
    accent: "from-cyan-500/18 via-cyan-500/6 to-transparent",
  },
];

function InsightRow({
  cards,
  label,
  reverse = false,
}: {
  cards: typeof problemCards;
  label: string;
  reverse?: boolean;
}) {
  const repeatedCards = [...cards, ...cards];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-red-400/20 to-transparent" />
        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <div className="h-px flex-1 bg-gradient-to-l from-red-400/20 to-transparent" />
      </div>

      <div className="mask-fade-x overflow-hidden rounded-[2rem] border border-white/8 bg-black/20 px-3 py-3">
        <div className={`marquee-track flex min-w-max gap-4 ${reverse ? "marquee-track-reverse" : ""}`}>
          {repeatedCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <article
                key={`${label}-${card.title}-${index}`}
                className="relative flex min-h-[15.5rem] w-[320px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0608]/92 p-6 shadow-[0_20px_48px_rgba(0,0,0,0.3)] sm:w-[360px]"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent}`} />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-[1.3rem] border border-white/10 bg-white/[0.05] text-red-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] text-white">{card.title}</h3>
                  <p className="mt-4 max-w-[26ch] text-base leading-8 text-slate-300">{card.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function InsightMarquee() {
  return (
    <div className="space-y-5 rounded-[2.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,6,8,0.72),rgba(7,3,4,0.92))] p-4 sm:p-5">
      <InsightRow cards={problemCards} label="Problem patterns" />
      <InsightRow cards={solutionCards} label="Copilot outputs" reverse />
    </div>
  );
}
