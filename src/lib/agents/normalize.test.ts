import { describe, expect, it } from "vitest";
import { normalizeAgent } from "./normalize";
import type { ScanAgentDetail } from "./types";

const base: ScanAgentDetail = {
  id: "row", agent_id: "56:registry:1", token_id: "1", chain_id: 56, chain_type: "evm",
  contract_address: "0x0000000000000000000000000000000000000001", is_testnet: false,
  owner_address: "0x0000000000000000000000000000000000000002", name: "Grid agent",
  description: "grid trading", image_url: "", is_verified: false, star_count: 0,
  supported_protocols: ["A2A"], x402_supported: false, total_score: 0, health_score: null,
  total_feedbacks: 0, average_score: 0, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
};

describe("normalizeAgent", () => {
  it("counts observed service-map fields", () => {
    const result = normalizeAgent({ ...base, services: { a2a: { endpoint: "https://example.test" } } });
    expect(result.derived.endpointCount).toBe(1);
  });
  it("does not turn x402 into ERC-8183", () => {
    const result = normalizeAgent({ ...base, x402_supported: true });
    expect(result.derived.commerce).toBe("x402");
  });
});
