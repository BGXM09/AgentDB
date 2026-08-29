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
    ...overrides,
  };
}

describe("rankCategoryAgents", () => {
  const category = categories[0];

  it("keeps audited candidates first", () => {
    const ranked = rankCategoryAgents(category, [
      agent("unreviewed", { is_verified: true, total_feedbacks: 20, average_score: 5, total_score: 100 }),
      agent(category.auditedIds[0], { total_score: 0 }),
    ]);
    expect(ranked[0].token_id).toBe(category.auditedIds[0]);
  });

  it("removes duplicate and empty low-quality profiles from the count", () => {
    const ranked = rankCategoryAgents(category, [
      agent("useful"),
      agent("useful"),
      agent("empty", { description: "" }),
    ]);
    expect(ranked.map((item) => item.token_id)).toEqual(["useful"]);
  });

  it("rejects semantically returned candidates without category evidence", () => {
    const ranked = rankCategoryAgents(category, [
      agent("unrelated", { description: "A complete service for writing and translating marketing content.", similarity_score: 0.79 }),
    ]);
    expect(ranked).toEqual([]);
  });

  it("accepts structured category evidence from raw agent metadata", () => {
    const ranked = rankCategoryAgents(categories[1], [
      agent("structured", {
        description: "A complete crypto strategy service for BNB Chain users.",
        raw_metadata: { offchain_content: { attributes: [{ trait_type: "Category", value: "grid-trading" }] } },
      }),
    ]);
    expect(ranked[0].token_id).toBe("structured");
  });

  it("uses trust and activity to reorder similarly relevant candidates", () => {
    const ranked = rankCategoryAgents(category, [
      agent("plain"),
      agent("trusted", { is_verified: true, total_feedbacks: 10, average_score: 5, health_score: 100 }),
    ]);
    expect(ranked[0].token_id).toBe("trusted");
  });
});
