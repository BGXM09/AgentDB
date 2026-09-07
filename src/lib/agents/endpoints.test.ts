import { describe, expect, it } from "vitest";
import { agentEndpoints, publicHttpUrl } from "./endpoints";

describe("published service endpoints", () => {
  it("keeps sibling protocol labels and deduplicates indexed copies", () => {
    expect(agentEndpoints({ services: [{ name: "MCP", endpoint: "https://tools.example.com/rpc" }], raw_metadata: { services: [{ name: "MCP", endpoint: "https://tools.example.com/rpc" }] } })).toEqual([{ label: "MCP endpoint", protocol: "MCP", url: "https://tools.example.com/rpc" }]);
  });
  it("does not treat metadata images, docs or declared protocols as connections", () => {
    expect(agentEndpoints({ supported_protocols: ["MCP"], metadata: { image: "https://example.com/art.png", url: "https://example.com", services: { mcp: { documentation: "https://docs.example.com", description: "https://description.example.com" } } } })).toEqual([]);
  });
  it("handles keyed services, array endpoints, and malformed records", () => {
    expect(agentEndpoints({ services: { a2a: { endpoint: "https://example.com/rpc" } }, endpoints: [null, 42, "javascript:alert(1)"] })[0].protocol).toBe("A2A");
  });
  it.each(["javascript:alert(1)", "file:///etc/passwd", "https://user:pass@example.com", "http://localhost:3000", "http://127.0.0.1", "http://10.0.0.1", "http://192.168.1.1", "http://172.16.0.1", "http://[::1]"])("rejects unsafe URL %s", (url) => expect(publicHttpUrl(url)).toBeNull());
  it("retains a public URL", () => expect(publicHttpUrl(" https://agent.example.com/a2a ")).toBe("https://agent.example.com/a2a"));
});
