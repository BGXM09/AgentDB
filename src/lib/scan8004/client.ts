import type { ScanAgentDetail, ScanAgentPage } from "@/lib/agents/types";

const BASE_URL = "https://api.8004scan.io/api/v1";

export class Scan8004Error extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}

async function request<T>(path: string, params?: URLSearchParams): Promise<T> {
  const apiKey = process.env.SCAN8004_API_KEY;
  if (!apiKey) throw new Scan8004Error("8004scan is not configured.");
  const url = `${BASE_URL}${path}${params?.size ? `?${params}` : ""}`;
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "X-API-Key": apiKey, Accept: "application/json" },
        next: { revalidate: 15 },
      });
      if (response.ok) return await response.json() as T;
      if (response.status !== 429 && response.status < 500) {
        throw new Scan8004Error(`8004scan request failed (${response.status}).`, response.status);
      }
      lastError = new Scan8004Error(`8004scan temporarily unavailable (${response.status}).`, response.status);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
  }
  throw lastError instanceof Error ? lastError : new Scan8004Error("8004scan request failed.");
}

export async function listBscAgents(options: { limit?: number; offset?: number; sortBy?: "total_score" | "created_at" | "total_feedbacks"; minFeedbacks?: number; hasA2a?: boolean } = {}) {
  const params = new URLSearchParams({
    chain_id: "56",
    limit: String(Math.min(options.limit ?? 10, 50)),
    offset: String(Math.max(options.offset ?? 0, 0)),
    sort_by: options.sortBy ?? "created_at",
    sort_order: "desc",
  });
  if (options.minFeedbacks) params.set("min_feedbacks", String(options.minFeedbacks));
  if (options.hasA2a) params.set("has_a2a", "true");
  return request<ScanAgentPage>("/agents", params);
}

export async function listPopularBscAgents(limit = 10) {
  const params = new URLSearchParams({
    chain_id: "56",
    is_testnet: "false",
    period: "all",
    sort_by: "popularity_score",
    limit: String(Math.min(Math.max(limit, 1), 100)),
    offset: "0",
    group_cross_chain: "false",
  });
  return request<ScanAgentPage>("/agents/leaderboard", params);
}

export async function searchBscAgents(query: string, limit = 10) {
  const params = new URLSearchParams({ q: query, chain_id: "56", limit: String(Math.min(limit, 100)) });
  return request<ScanAgentPage>("/agents/search/semantic", params);
}

export async function searchBscAgentCategory(queries: string[], limit = 100, reviewedIds: string[] = []): Promise<ScanAgentPage> {
  const query = queries.join("; ");
  const [page, ...reviewed] = await Promise.all([
    searchBscAgents(query, limit),
    ...reviewedIds.map((tokenId) => getBscAgent(tokenId).catch(() => null)),
  ]);
  const items = [...new Map([...reviewed.filter((agent): agent is ScanAgentDetail => Boolean(agent)), ...page.items].map((agent) => [agent.token_id, agent])).values()];
  return { ...page, items, total: items.length };
}

export async function getBscAgent(tokenId: string) {
  return request<ScanAgentDetail>(`/agents/56/${encodeURIComponent(tokenId)}`);
}
