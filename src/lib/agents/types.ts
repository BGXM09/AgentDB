export type AgentCategory =
  | "Rebalancing"
  | "Grid Trading"
  | "Yield Optimisation"
  | "Health Factor Monitoring"
  | "Trading & Markets"
  | "DeFi & Finance"
  | "Security & Risk"
  | "Data & Analytics"
  | "Developer Tools"
  | "Content & Research"
  | "Commerce & Payments"
  | "Automation"
  | "General Assistant"
  | "Other";

export interface ScanAgentSummary {
  id: string;
  agent_id: string;
  token_id: string;
  chain_id: number;
  chain_type: string;
  contract_address: string;
  is_testnet: boolean;
  owner_address: string;
  name: string;
  description: string;
  image_url: string;
  is_verified: boolean;
  star_count: number;
  supported_protocols: string[];
  x402_supported: boolean;
  total_score: number;
  health_score: number | null;
  total_feedbacks: number;
  average_score: number;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface ScanAgentDetail extends ScanAgentSummary {
  tags?: string[] | null;
  services?: unknown[] | Record<string, unknown> | null;
  endpoints?: unknown[];
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface ScanAgentPage {
  items: ScanAgentSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface NormalizedAgent {
  canonical: {
    id: string;
    tokenId: string;
    chainId: number;
    contractAddress: string;
    ownerAddress: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    protocols: string[];
    verified: boolean;
    feedbackCount: number;
    averageScore: number | null;
    createdAt: string;
  };
  derived: {
    category: AgentCategory;
    categoryConfidence: "high" | "medium" | "low";
    categoryEvidence: string[];
    endpointCount: number | null;
    commerce: "erc-8183" | "x402" | "unknown";
    hireability: "candidate" | "not-detected" | "unknown";
  };
}
