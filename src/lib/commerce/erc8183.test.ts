import { describe, expect, it } from "vitest";
import { ERC8183_ADDRESSES } from "./contracts";
import { parseNegotiatedQuote } from "./erc8183";

const data = { response: { accepted: true, terms: { price: "100000000000000000", currency: ERC8183_ADDRESSES[56].paymentToken }, estimated_completion_seconds: 600, quote_expires_at: Math.floor(Date.now() / 1000) + 600 }, request: { task_description: "test" }, request_hash: `0x${"1".repeat(64)}`, response_hash: `0x${"2".repeat(64)}`, negotiation_hash: `0x${"3".repeat(64)}`, provider_sig: `0x${"4".repeat(130)}`, chain_id: 56, verifying_contract: ERC8183_ADDRESSES[56].commerce };

describe("parseNegotiatedQuote", () => {
  it("accepts a complete quote bound to official BSC contracts", () => { const quote = parseNegotiatedQuote("1", "0x0000000000000000000000000000000000000001", { result: { parts: [{ kind: "data", data }] } }); expect(quote.priceDisplay).toBe("0.1 $U"); expect(quote.chainId).toBe(56); });
  it("accepts a direct Agent Studio negotiation response", () => { const quote = parseNegotiatedQuote("1", "0x0000000000000000000000000000000000000001", data); expect(quote.priceDisplay).toBe("0.1 $U"); });
  it("rejects the wrong payment token", () => expect(() => parseNegotiatedQuote("1", "0x0000000000000000000000000000000000000001", { result: { parts: [{ kind: "data", data: { ...data, response: { ...data.response, terms: { ...data.response.terms, currency: "0x0000000000000000000000000000000000000002" } } } }] } })).toThrow(/official/));
});
