import type { AnalyticsOverview, BusinessDetail, BusinessListItem, SearchRunSummary } from "./types";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({ error: "Request failed" }))) as { error?: string };
    throw new Error(payload.error ?? "Request failed");
  }

  return (await response.json()) as T;
}

export function getRuns() {
  return request<SearchRunSummary[]>("/api/runs");
}

export function createRun(query: string, limit: number) {
  return request<SearchRunSummary>("/api/runs", {
    method: "POST",
    body: JSON.stringify({ query, limit }),
  });
}

export function getOverview(runId?: number) {
  const url = runId ? `/api/analytics/overview?runId=${runId}` : "/api/analytics/overview";
  return request<AnalyticsOverview>(url);
}

export function getBusinesses(runId?: number, search?: string) {
  const params = new URLSearchParams();
  if (runId) {
    params.set("runId", String(runId));
  }
  if (search?.trim()) {
    params.set("search", search.trim());
  }
  const url = params.size > 0 ? `/api/businesses?${params.toString()}` : "/api/businesses";
  return request<BusinessListItem[]>(url);
}

export function getBusinessDetail(businessId: number) {
  return request<BusinessDetail>(`/api/businesses/${businessId}`);
}
