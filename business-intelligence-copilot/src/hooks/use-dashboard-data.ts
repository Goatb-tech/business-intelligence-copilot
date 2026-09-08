import { useEffect, useState } from "react";

import { createRun, getBusinessDetail, getBusinesses, getOverview, getRuns } from "../lib/api";
import type { AnalyticsOverview, BusinessDetail, BusinessListItem, SearchRunSummary } from "../lib/types";

type DashboardState = {
  runs: SearchRunSummary[];
  overview: AnalyticsOverview | null;
  businesses: BusinessListItem[];
  selectedRunId?: number;
  selectedBusinessId?: number;
  selectedBusiness: BusinessDetail | null;
  isLoading: boolean;
  isCreatingRun: boolean;
  error: string | null;
};

export function useDashboardData(search: string) {
  const [state, setState] = useState<DashboardState>({
    runs: [],
    overview: null,
    businesses: [],
    selectedRunId: undefined,
    selectedBusinessId: undefined,
    selectedBusiness: null,
    isLoading: true,
    isCreatingRun: false,
    error: null,
  });

  useEffect(() => {
    void refresh(state.selectedRunId, search);
  }, [state.selectedRunId, search]);

  useEffect(() => {
    if (!state.selectedBusinessId) {
      setState((current) => ({ ...current, selectedBusiness: null }));
      return;
    }

    let cancelled = false;

    void getBusinessDetail(state.selectedBusinessId)
      .then((business) => {
        if (cancelled) {
          return;
        }
        setState((current) => ({ ...current, selectedBusiness: business }));
      })
      .catch((error: Error) => {
        if (cancelled) {
          return;
        }
        setState((current) => ({ ...current, error: error.message }));
      });

    return () => {
      cancelled = true;
    };
  }, [state.selectedBusinessId]);

  async function refresh(nextRunId = state.selectedRunId, nextSearch = search) {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const [runs, overview, businesses] = await Promise.all([
        getRuns(),
        getOverview(nextRunId),
        getBusinesses(nextRunId, nextSearch),
      ]);

      setState((current) => {
        const selectedRunId = current.selectedRunId ?? runs[0]?.id;
        const hasSelected = businesses.some((business) => business.id === current.selectedBusinessId);
        const selectedBusinessId = hasSelected ? current.selectedBusinessId : businesses[0]?.id;

        return {
          ...current,
          runs,
          overview,
          businesses,
          selectedRunId: nextRunId ?? selectedRunId,
          selectedBusinessId,
          isLoading: false,
        };
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load dashboard",
      }));
    }
  }

  async function createSearchRun(query: string, limit: number) {
    setState((current) => ({ ...current, isCreatingRun: true, error: null }));

    try {
      const run = await createRun(query, limit);
      await refresh(run.id, "");
      setState((current) => ({
        ...current,
        isCreatingRun: false,
        selectedRunId: run.id,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        isCreatingRun: false,
        error: error instanceof Error ? error.message : "Failed to create run",
      }));
    }
  }

  return {
    ...state,
    refresh: () => refresh(),
    createSearchRun,
    selectRun: (runId?: number) => setState((current) => ({ ...current, selectedRunId: runId })),
    selectBusiness: (businessId?: number) => setState((current) => ({ ...current, selectedBusinessId: businessId })),
  };
}
