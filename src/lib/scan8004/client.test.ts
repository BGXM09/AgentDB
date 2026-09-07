import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getBscAgent, searchBscAgents } from "./client";

const page = { items: [], total: 0, limit: 10, offset: 0 };
describe("agent search resilience", () => {
  beforeEach(() => { vi.stubEnv("SCAN8004_API_KEY", "test-only"); });
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
  it("routes short keyword queries through indexed search", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json(page));
    vi.stubGlobal("fetch", fetch);
    await searchBscAgents("grid");
    expect(fetch.mock.calls[0][0]).toContain("/agents?search=grid&chain_id=56");
  });
  it("falls back to indexed text when semantic search fails", async () => {
    const fetch = vi.fn().mockRejectedValueOnce(new Error("Semantic service timed out")).mockResolvedValueOnce(Response.json(page));
    vi.stubGlobal("fetch", fetch);
    expect(await searchBscAgents("monitor my lending position")).toEqual(page);
    expect(fetch.mock.calls[0][0]).toContain("/search/semantic?");
    expect(fetch.mock.calls[1][0]).toContain("/agents?search=monitor+my+lending+position");
  });
  it("does not retry a missing identity", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response("Not found", { status: 404 }));
    vi.stubGlobal("fetch", fetch);
    await expect(getBscAgent("99999")).rejects.toMatchObject({ status: 404 });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
