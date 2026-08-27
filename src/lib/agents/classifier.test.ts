import { describe, expect, it } from "vitest";
import { classifyAgent } from "./classifier";

const agent = (description: string) => ({ name: "Test", description, tags: [], supported_protocols: [], services: null, endpoints: [], metadata: null });

describe("classifyAgent", () => {
  it("detects all required categories from explicit evidence", () => {
    expect(classifyAgent(agent("automated LP rebalancing")).category).toBe("Rebalancing");
    expect(classifyAgent(agent("grid trading strategy")).category).toBe("Grid Trading");
    expect(classifyAgent(agent("yield optimization at best APY")).category).toBe("Yield Optimisation");
    expect(classifyAgent(agent("health factor liquidation monitoring")).category).toBe("Health Factor Monitoring");
  });
  it("keeps records without meaningful metadata in the fallback category", () => expect(classifyAgent(agent("Experimental agent")).category).toBe("Other"));
  it("uses declared service metadata when the short description is sparse", () => {
    expect(classifyAgent({ ...agent("DeFi assistant"), metadata: { skills: [{ name: "Collateral risk alerts" }] } }).category).toBe("Health Factor Monitoring");
    expect(classifyAgent({ ...agent("Trading assistant"), services: [{ description: "Automated limit order strategy" }] }).category).toBe("Grid Trading");
  });
  it("uses 8004scan tags and broader consumer categories", () => {
    expect(classifyAgent({ ...agent(""), tags: ["security", "smart-contract-audit"] }).category).toBe("Security & Risk");
    expect(classifyAgent(agent("Research and summarize market news")).category).toBe("Content & Research");
    expect(classifyAgent(agent("General customer support assistant")).category).toBe("General Assistant");
  });
});
