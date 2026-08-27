import { describe, expect, it } from "vitest";
import { classifyAgent } from "./classifier";

const agent = (description: string) => ({ name: "Test", description, supported_protocols: [], services: null, endpoints: [], metadata: null });

describe("classifyAgent", () => {
  it("detects all required categories from explicit evidence", () => {
    expect(classifyAgent(agent("automated LP rebalancing")).category).toBe("Rebalancing");
    expect(classifyAgent(agent("grid trading strategy")).category).toBe("Grid Trading");
    expect(classifyAgent(agent("yield optimization at best APY")).category).toBe("Yield Optimisation");
    expect(classifyAgent(agent("health factor liquidation monitoring")).category).toBe("Health Factor Monitoring");
  });
  it("does not force an unsupported category", () => expect(classifyAgent(agent("general assistant")).category).toBe("Other"));
  it("uses declared service metadata when the short description is sparse", () => {
    expect(classifyAgent({ ...agent("DeFi assistant"), metadata: { skills: [{ name: "Collateral risk alerts" }] } }).category).toBe("Health Factor Monitoring");
    expect(classifyAgent({ ...agent("Trading assistant"), services: [{ description: "Automated limit order strategy" }] }).category).toBe("Grid Trading");
  });
});
