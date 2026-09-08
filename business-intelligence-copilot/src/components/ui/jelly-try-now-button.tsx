import { ArrowRight } from "lucide-react";

type JellyTryNowButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
};

export function JellyTryNowButton({ label, onClick, className = "" }: JellyTryNowButtonProps) {
  return (
    <button
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-4 text-sm font-semibold text-white transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
      onClick={onClick}
      type="button"
    >
      <span className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(239,35,60,0.95),rgba(119,18,33,0.95))]" />
      <span className="absolute inset-0 rounded-full border border-red-200/18" />
      <span className="absolute inset-[1px] rounded-full bg-[linear-gradient(180deg,rgba(20,7,9,0.2),rgba(7,3,4,0.05))]" />
      <span className="absolute inset-[1px] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_30px_rgba(239,35,60,0.22)]" />
      <span className="absolute -left-1/4 top-[1px] h-[calc(100%-2px)] w-1/3 rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)] opacity-70 blur-[1px] transition-transform duration-500 group-hover:translate-x-10" />
      <span className="relative z-10 flex items-center gap-2 uppercase tracking-[0.22em]">
        {label}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}
