import { describe, expect, it } from "vitest";
import { categories, rankCategoryAgents } from "./catalog";
import type { ScanAgentSummary } from "./types";

function agent(tokenId: string, overrides: Partial<ScanAgentSummary> = {}): ScanAgentSummary {
  return {
    id: tokenId,
    agent_id: tokenId,
    token_id: tokenId,
    chain_id: 56,
    chain_type: "evm",
    contract_address: "0x0000000000000000000000000000000000000000",
    is_testnet: false,
    owner_address: "0x0000000000000000000000000000000000000000",
    name: `Agent ${tokenId}`,
    description: "A complete portfolio rebalancing service with plain-language instructions.",
    image_url: "",
    is_verified: false,
    star_count: 0,
    supported_protocols: [],
    x402_supported: false,
    total_score: 0,
    health_score: null,
    total_feedbacks: 0,
    average_score: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    similarity_score: 0.8,
    ...overrides,
  };
}

describe("rankCategoryAgents", () => {
  const category = categories[0];

  it("uses semantic similarity as the category-membership signal", () => {
    const ranked = rankCategoryAgents(category, [
      agent("weaker-match", { similarity_score: 0.72 }),
      agent("stronger-match", { similarity_score: 0.92 }),
    ]);
    expect(ranked[0].token_id).toBe("stronger-match");
  });

  it("removes duplicate and empty low-quality profiles from the count", () => {
    const ranked = rankCategoryAgents(category, [
      agent("useful"),
      agent("useful"),
      agent("not-semantic", { similarity_score: undefined }),
    ]);
    expect(ranked.map((item) => item.token_id)).toEqual(["useful"]);
  });

  it("rejects candidates without category or semantic evidence", () => {
    const ranked = rankCategoryAgents(category, [
      agent("unrelated", { description: "A complete service for writing and translating marketing content.", similarity_score: undefined }),
    ]);
    expect(ranked).toEqual([]);
  });

  it("uses semantic candidates to backfill the curated category", () => {
    const ranked = rankCategoryAgents(category, [
      agent("semantic", { description: "A complete service for managing assets according to user instructions.", similarity_score: 0.79 }),
    ]);
    expect(ranked[0].token_id).toBe("semantic");
  });

  it("caps every category at the shared display depth", () => {
    const ranked = rankCategoryAgents(category, Array.from({ length: 70 }, (_, index) => agent(String(index), { similarity_score: 0.8 })));
    expect(ranked).toHaveLength(50);
  });

  it("keeps only the strongest semantic match for duplicate normalized names", () => {
    const ranked = rankCategoryAgents(category, [
      agent("first", { name: "Portfolio Pilot.agent", similarity_score: 0.81 }),
      agent("second", { name: "portfolio-pilot", similarity_score: 0.92 }),
      agent("third", { name: "PORTFOLIO PILOT #123", similarity_score: 0.75 }),
    ]);
    expect(ranked).toHaveLength(1);
    expect(ranked[0].token_id).toBe("second");
  });

  it("uses trust and activity to reorder similarly relevant candidates", () => {
    const ranked = rankCategoryAgents(category, [
      agent("plain"),
      agent("trusted", { is_verified: true, total_feedbacks: 10, average_score: 5, health_score: 100 }),
    ]);
    expect(ranked[0].token_id).toBe("trusted");
  });
});
