import type { ScanAgentDetail, ScanAgentPage, ScanAgentSummary } from "@/lib/agents/types";

const BASE_URL = "https://api.8004scan.io/api/v1";

export class Scan8004Error extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}

async function request<T>(path: string, params?: URLSearchParams, options: { attempts?: number; timeout?: number } = {}): Promise<T> {
  const apiKey = process.env.SCAN8004_API_KEY;
  if (!apiKey) throw new Scan8004Error("8004scan is not configured.");
  const url = `${BASE_URL}${path}${params?.size ? `?${params}` : ""}`;
  let lastError: unknown;
  for (let attempt = 0; attempt < (options.attempts ?? 3); attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "X-API-Key": apiKey, Accept: "application/json" },
        next: { revalidate: path.includes("/search/") ? 300 : 30 },
        signal: AbortSignal.timeout(options.timeout ?? 12_000),
      });
      if (response.ok) return await response.json() as T;
      if (response.status !== 429 && response.status < 500) {
        throw new Scan8004Error(`8004scan request failed (${response.status}).`, response.status);
      }
      lastError = new Scan8004Error(`8004scan temporarily unavailable (${response.status}).`, response.status);
    } catch (error) {
      if (error instanceof Scan8004Error && error.status && error.status < 500 && error.status !== 429) throw error;
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
  const trimmed = query.trim().slice(0, 500);
  // Names, IDs and wallet addresses use the provider's deterministic search.
  // Natural-language intent can use semantic search, with a bounded fallback.
  if (trimmed.split(/\s+/).length > 2) {
    try { return await semanticSearch(trimmed, limit); } catch { /* Fall back to indexed text search. */ }
  }
  return keywordSearch(trimmed, limit);
}

function keywordSearch(query: string, limit: number) {
  return request<ScanAgentPage>("/agents", new URLSearchParams({ search: query, chain_id: "56", limit: String(Math.min(limit, 50)), sort_by: "total_score", sort_order: "desc" }));
}

function semanticSearch(query: string, limit: number) {
  return request<ScanAgentPage>("/agents/search/semantic", new URLSearchParams({ q: query, chain_id: "56", limit: String(Math.min(limit, 100)) }), { attempts: 1, timeout: 8_000 });
}

export async function searchBscAgentCategory(queries: string[], limit = 100): Promise<ScanAgentPage> {
  const results = await Promise.allSettled(queries.map((query) => semanticSearch(query, limit)));
  const pages = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  if (!pages.length) pages.push(await keywordSearch(queries[0].split(" and ")[0], limit));
  const byToken = new Map<string, ScanAgentSummary>();
  for (const agent of pages.flatMap((page) => page.items)) {
    const existing = byToken.get(agent.token_id);
    if (!existing || (agent.similarity_score ?? 0) > (existing.similarity_score ?? 0)) byToken.set(agent.token_id, agent);
  }
  const items = [...byToken.values()];
  return { items, total: items.length, limit, offset: 0 };
}

export async function getBscAgent(tokenId: string) {
  return request<ScanAgentDetail>(`/agents/56/${encodeURIComponent(tokenId)}`);
}
