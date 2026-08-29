import { randomUUID } from "node:crypto";
import { formatUnits, isAddress, isHex } from "viem";
import { ERC8183_ADDRESSES } from "./contracts";
import { getBscAgent } from "../scan8004/client";
import type { CommerceAdapter, Quote, QuoteRequest } from "./types";

type NegotiationData = { response?: { accepted?: boolean; terms?: { price?: string; currency?: string }; estimated_completion_seconds?: number; quote_expires_at?: number }; request?: unknown; request_hash?: string; response_hash?: string; negotiation_hash?: string; provider_sig?: string; chain_id?: number; verifying_contract?: string };

function findServiceEndpoint(services: unknown): string | null {
  const serialized = services as Record<string, unknown> | null;
  if (!serialized) return null;
  const candidates: unknown[] = Array.isArray(serialized) ? serialized : Object.values(serialized);
  for (const candidate of candidates) {
    if (typeof candidate === "string" && /^https:\/\//.test(candidate)) return candidate;
    if (candidate && typeof candidate === "object") {
      const value = candidate as Record<string, unknown>;
      const endpoint = value.endpoint ?? value.url;
      if (typeof endpoint === "string" && /^https:\/\//.test(endpoint)) return endpoint;
    }
  }
  return null;
}

export function parseNegotiatedQuote(agentId: string, provider: string, payload: unknown): Quote {
  const root = payload as { result?: { parts?: Array<{ kind?: string; data?: NegotiationData }> } } & NegotiationData;
  const data = root.result?.parts?.find((part) => part.kind === "data")?.data ?? (root.response ? root : undefined);
  const terms = data?.response?.terms;
  const addresses = ERC8183_ADDRESSES[56];
  if (!data?.response?.accepted || !terms?.price || !terms.currency || !data.negotiation_hash || !data.provider_sig || data.chain_id !== 56 || !data.verifying_contract) throw new Error("Agent returned an incomplete quote.");
  if (!isAddress(provider) || !isAddress(terms.currency) || !isAddress(data.verifying_contract) || !isHex(data.negotiation_hash) || !isHex(data.provider_sig)) throw new Error("Agent returned invalid quote fields.");
  if (terms.currency.toLowerCase() !== addresses.paymentToken.toLowerCase() || data.verifying_contract.toLowerCase() !== addresses.commerce.toLowerCase()) throw new Error("Quote does not target the official BSC ERC-8183 deployment.");
  const expiresAt = Number(data.response.quote_expires_at ?? 0);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) throw new Error("Quote has expired.");
  const price = BigInt(terms.price);
  if (price <= BigInt(0)) throw new Error("Quote price must be positive.");
  const envelope = { request: data.request, request_hash: data.request_hash, response: data.response, response_hash: data.response_hash, negotiation_hash: data.negotiation_hash, provider_sig: data.provider_sig, chain_id: data.chain_id, verifying_contract: data.verifying_contract };
  return { agentId, provider: provider as `0x${string}`, chainId: 56, price: price.toString(), currency: terms.currency as `0x${string}`, priceDisplay: `${formatUnits(price, 18)} $U`, estimatedCompletionSeconds: Number(data.response.estimated_completion_seconds ?? 0), expiresAt, negotiationHash: data.negotiation_hash as `0x${string}`, providerSignature: data.provider_sig as `0x${string}`, verifyingContract: data.verifying_contract as `0x${string}`, anchoredTask: JSON.stringify(envelope) };
}

export class ERC8183CommerceAdapter implements CommerceAdapter {
  async detect(agentId: string) {
    const agent = await getBscAgent(agentId);
    const endpoint = findServiceEndpoint(agent.services ?? agent.endpoints ?? agent.metadata?.services);
    const record = JSON.stringify(agent).toLowerCase();
    return Boolean(endpoint && (record.includes("erc8183") || record.includes("erc-8183") || record.includes("/apex")));
  }
  async getQuote(input: QuoteRequest) {
    const agent = await getBscAgent(input.agentId);
    if (!(await this.detect(input.agentId))) throw new Error("This agent is not ready to hire.");
    const cardUrl = findServiceEndpoint(agent.services ?? agent.endpoints ?? agent.metadata?.services);
    if (!cardUrl) throw new Error("This agent is temporarily unavailable.");
    const parsedCard = new URL(cardUrl);
    if (parsedCard.protocol !== "https:") throw new Error("This agent does not use a secure service endpoint.");
    const studioApex = parsedCard.pathname.includes("/apex");
    let card: { url?: string } = {};
    if (!studioApex) {
      const cardResponse = await fetch(cardUrl, { signal: AbortSignal.timeout(15_000), cache: "no-store" });
      if (!cardResponse.ok) throw new Error("Agent card is unavailable.");
      card = await cardResponse.json() as { url?: string };
    }
    const messageUrl = new URL(studioApex ? cardUrl.replace(/\/$/, "") + "/negotiate" : card.url ?? cardUrl);
    if (messageUrl.protocol !== "https:" || messageUrl.hostname !== parsedCard.hostname) throw new Error("Agent messaging endpoint is not secure.");
    const negotiation = { task_description: input.taskDescription, terms: { deliverables: input.deliverables, quality_standards: input.qualityStandards } };
    const rpcBody = studioApex ? negotiation : { jsonrpc: "2.0", id: randomUUID(), method: "message/send", params: { message: { role: "user", messageId: randomUUID(), parts: [{ kind: "data", data: { skill: "negotiate", ...negotiation } }] } } };
    const response = await fetch(messageUrl, { method: "POST", headers: { "content-type": "application/json" }, signal: AbortSignal.timeout(30_000), body: JSON.stringify(rpcBody) });
    if (!response.ok) throw new Error("Agent quote request failed.");
    return parseNegotiatedQuote(input.agentId, typeof agent.agent_wallet === "string" ? agent.agent_wallet : agent.owner_address, await response.json());
  }
}
