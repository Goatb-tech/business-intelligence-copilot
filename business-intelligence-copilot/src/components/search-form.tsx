import { useState } from "react";

export function SearchForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (query: string, limit: number) => Promise<void> | void;
  isSubmitting: boolean;
}) {
  const [query, setQuery] = useState("dentist in Austin");
  const [limit, setLimit] = useState(12);

  return (
    <form
      className="grid gap-3 lg:grid-cols-[1fr_140px_160px]"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(query, limit);
      }}
    >
      <label className="grid gap-2 text-sm text-slate-200">
        <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Search query</span>
        <input
          className="input-noir rounded-[22px] px-4 py-3 text-sm ring-0"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="barber in Atlanta"
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-200">
        <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Limit</span>
        <input
          className="input-noir rounded-[22px] px-4 py-3 text-sm ring-0"
          type="number"
          min={1}
          max={30}
          value={limit}
          onChange={(event) => setLimit(Number(event.target.value))}
        />
      </label>

      <button
        className="button-accent rounded-[22px] px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isSubmitting || query.trim().length < 3}
      >
        {isSubmitting ? "Running..." : "Create Run"}
      </button>
    </form>
  );
}
