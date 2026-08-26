import { describe, expect, it } from "vitest";
import { classifyAgent } from "./classifier";

const agent = (description: string) => ({ name: "Test", description, supported_protocols: [] });

describe("classifyAgent", () => {
  it("detects all required categories from explicit evidence", () => {
    expect(classifyAgent(agent("automated LP rebalancing")).category).toBe("Rebalancing");
    expect(classifyAgent(agent("grid trading strategy")).category).toBe("Grid Trading");
    expect(classifyAgent(agent("yield optimization at best APY")).category).toBe("Yield Optimisation");
    expect(classifyAgent(agent("health factor liquidation monitoring")).category).toBe("Health Factor Monitoring");
  });
  it("does not force an unsupported category", () => expect(classifyAgent(agent("general assistant")).category).toBe("Other"));
});
