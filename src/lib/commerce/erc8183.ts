import { randomUUID } from "node:crypto";
import { ERC8183_ADDRESSES } from "@altananetwork/sdk";
import { formatUnits, isAddress, isHex } from "viem";
import { getBscAgent } from "../scan8004/client";
import type { CommerceAdapter, Quote, QuoteRequest } from "./types";

const AUDITED_AGENT_ID = "265375";
const AUDITED_HOST = "bnb-lp.172-104-171-139.nip.io";

type NegotiationData = { response?: { accepted?: boolean; terms?: { price?: string; currency?: string }; estimated_completion_seconds?: number; quote_expires_at?: number }; request?: unknown; request_hash?: string; response_hash?: string; negotiation_hash?: string; provider_sig?: string; chain_id?: number; verifying_contract?: string };

export function parseNegotiatedQuote(agentId: string, provider: string, payload: unknown): Quote {
  const root = payload as { result?: { parts?: Array<{ kind?: string; data?: NegotiationData }> } };
  const data = root.result?.parts?.find((part) => part.kind === "data")?.data;
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
  async detect(agentId: string) { return agentId === AUDITED_AGENT_ID; }
  async getQuote(input: QuoteRequest) {
    if (!(await this.detect(input.agentId))) throw new Error("No audited ERC-8183 quote integration is available for this agent.");
    const agent = await getBscAgent(input.agentId);
    const services = agent.services as Record<string, { endpoint?: string }> | null;
    const cardUrl = services?.a2a?.endpoint;
    if (!cardUrl) throw new Error("Agent has no A2A endpoint.");
    const parsedCard = new URL(cardUrl);
    if (parsedCard.protocol !== "https:" || parsedCard.hostname !== AUDITED_HOST) throw new Error("Agent endpoint is not allowlisted.");
    const cardResponse = await fetch(cardUrl, { signal: AbortSignal.timeout(15_000), cache: "no-store" });
    if (!cardResponse.ok) throw new Error("Agent card is unavailable.");
    const card = await cardResponse.json() as { url?: string };
    if (!card.url) throw new Error("Agent card has no messaging URL.");
    const messageUrl = new URL(card.url);
    if (messageUrl.protocol !== "https:" || messageUrl.hostname !== AUDITED_HOST) throw new Error("Agent messaging endpoint is not allowlisted.");
    const rpcBody = { jsonrpc: "2.0", id: randomUUID(), method: "message/send", params: { message: { role: "user", messageId: randomUUID(), parts: [{ kind: "data", data: { skill: "negotiate", task_description: input.taskDescription, terms: { deliverables: input.deliverables, quality_standards: input.qualityStandards } } }] } } };
    const response = await fetch(messageUrl, { method: "POST", headers: { "content-type": "application/json" }, signal: AbortSignal.timeout(30_000), body: JSON.stringify(rpcBody) });
    if (!response.ok) throw new Error("Agent quote request failed.");
    return parseNegotiatedQuote(input.agentId, typeof agent.agent_wallet === "string" ? agent.agent_wallet : agent.owner_address, await response.json());
  }
}
