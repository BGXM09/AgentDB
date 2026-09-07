import { describe, expect, it } from "vitest";
import { parseRegistration, registrationDataUri, registrationType, updateRegistration } from "./registration";

const original = { type: registrationType, name: "Agent 日本語", description: "Position monitor", image: "ipfs://image", services: [{ name: "A2A", endpoint: "https://old.example.com", version: "0.3" }, { name: "web", endpoint: "https://site.example.com" }], registrations: [{ agentId: 12, agentRegistry: "eip155:56:0x123" }], supportedTrust: ["reputation"], custom: { keep: true } };
describe("owner service registration", () => {
  it("updates a service without dropping other registration fields", () => {
    const updated = updateRegistration(JSON.stringify(original), "A2A", "https://new.example.com/rpc");
    expect(updated).toEqual({ ...original, services: [{ ...original.services[0], endpoint: "https://new.example.com/rpc" }, original.services[1]] });
  });
  it("adds an MCP service without modifying existing services", () => expect((updateRegistration(JSON.stringify(original), "MCP", "https://tools.example.com").services as unknown[])).toHaveLength(3));
  it("requires complete registration and a public HTTPS service", () => {
    expect(() => parseRegistration("{}")).toThrow("complete ERC-8004");
    expect(() => parseRegistration("not json")).toThrow("valid registration");
    expect(() => updateRegistration(JSON.stringify(original), "A2A", "http://public.example.com")).toThrow("HTTPS");
    expect(() => updateRegistration(JSON.stringify(original), "ERC-8183", "https://public.example.com")).toThrow("connection type");
  });
  it("round-trips non-ASCII registration content", () => {
    const encoded = registrationDataUri(original).split(",")[1];
    expect(JSON.parse(Buffer.from(encoded, "base64").toString("utf8"))).toEqual(original);
  });
  it("rejects oversized documents", () => expect(() => parseRegistration(" ".repeat(48_001))).toThrow("too large"));
});
