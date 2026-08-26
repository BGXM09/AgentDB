import { classifyAgent } from "./classifier";
import type { NormalizedAgent, ScanAgentDetail } from "./types";

function countEndpoints(agent: ScanAgentDetail): number | null {
  const metadata = agent.metadata;
  const services = agent.services ?? agent.endpoints ?? metadata?.services ?? metadata?.endpoints;
  if (Array.isArray(services)) return services.length;
  if (services && typeof services === "object") return Object.keys(services).length;
  return services === null ? 0 : null;
}

export function normalizeAgent(agent: ScanAgentDetail): NormalizedAgent {
  const classification = classifyAgent(agent);
  const serialized = JSON.stringify(agent).toLowerCase();
  const erc8183 = serialized.includes("8183");
  const x402 = agent.x402_supported || serialized.includes("x402");
  const endpointCount = countEndpoints(agent);

  return {
    canonical: {
      id: agent.agent_id,
      tokenId: agent.token_id,
      chainId: agent.chain_id,
      contractAddress: agent.contract_address,
      ownerAddress: agent.owner_address,
      name: agent.name || `Agent #${agent.token_id}`,
      description: agent.description || null,
      imageUrl: agent.image_url || null,
      protocols: agent.supported_protocols ?? [],
      verified: Boolean(agent.is_verified),
      feedbackCount: agent.total_feedbacks ?? 0,
      averageScore: agent.total_feedbacks ? agent.average_score : null,
      createdAt: agent.created_at,
    },
    derived: {
      category: classification.category,
      categoryConfidence: classification.confidence,
      categoryEvidence: classification.evidence,
      endpointCount,
      commerce: erc8183 ? "erc-8183" : x402 ? "x402" : "unknown",
      hireability: erc8183 && endpointCount !== 0 ? "candidate" : endpointCount === 0 ? "not-detected" : "unknown",
    },
  };
}
