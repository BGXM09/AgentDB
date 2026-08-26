export type QuoteRequest = { agentId: string; taskDescription: string; deliverables: string; qualityStandards: string };
export type Quote = {
  agentId: string; provider: `0x${string}`; chainId: 56; price: string; currency: `0x${string}`;
  priceDisplay: string; estimatedCompletionSeconds: number; expiresAt: number;
  negotiationHash: `0x${string}`; providerSignature: `0x${string}`; verifyingContract: `0x${string}`;
  anchoredTask: string;
};

export interface CommerceAdapter { detect(agentId: string): Promise<boolean>; getQuote(input: QuoteRequest): Promise<Quote>; }
