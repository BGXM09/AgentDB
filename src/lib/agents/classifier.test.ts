import { describe, expect, it } from "vitest";
import { classifyAgent, classifyConsumerCategories } from "./classifier";

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
    expect(classifyAgent({ ...agent("Trading assistant"), services: [{ description: "Automated grid order strategy" }] }).category).toBe("Grid Trading");
  });
  it("uses 8004scan tags and broader consumer categories", () => {
    expect(classifyAgent({ ...agent(""), tags: ["security", "smart-contract-audit"] }).category).toBe("Security & Risk");
    expect(classifyAgent(agent("Research and summarize market news")).category).toBe("Content & Research");
    expect(classifyAgent(agent("General customer support assistant")).category).toBe("General Assistant");
  });
  it("returns multiple consumer categories when metadata supports more than one job", () => {
    const matches = classifyConsumerCategories({
      ...agent("Monitors health factors and rebalances concentrated liquidity positions."),
      categories: [],
      raw_metadata: null,
    });
    expect(matches.map((match) => match.category)).toEqual(["Health Factor Monitoring", "Rebalancing"]);
  });
  it("reads OASF and attribute evidence from normalized 8004scan metadata", () => {
    const matches = classifyConsumerCategories({
      ...agent("A complete onchain service."),
      categories: [],
      services: { oasf: { domains: ["finance_and_business/investment_services"], skills: ["yield_optimization"] } },
      raw_metadata: { offchain_content: { attributes: [{ trait_type: "Category", value: "grid-trading" }] } },
    });
    expect(matches.map((match) => match.category)).toEqual(["Grid Trading", "Yield Optimisation"]);
    expect(matches.every((match) => match.confidence === "high")).toBe(true);
  });
});
