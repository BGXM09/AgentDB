import type { AgentCategory, ScanAgentSummary } from "./types";

export const CATEGORY_DISPLAY_DEPTH = 50;

export const categories: Array<{ slug: string; name: AgentCategory; queries: string[]; description: string; auditedIds: string[]; art: string }> = [
  { slug: "rebalancing", name: "Rebalancing", queries: ["portfolio rebalancing and asset allocation", "LP liquidity range management", "automated DeFi portfolio management", "concentrated liquidity positions", "crypto portfolio management", "DeFi liquidity management", "automated asset allocation", "portfolio allocation agent"], description: "Keep a portfolio or liquidity position close to the plan you chose.", auditedIds: ["265375", "293054", "45650"], art: "/media/categories/rebalancing.jpg" },
  { slug: "grid-trading", name: "Grid Trading", queries: ["grid trading and limit orders", "automated crypto trading bot", "algorithmic market making", "DEX trading automation", "crypto limit order agent", "automated market maker agent", "spot trading strategy", "crypto arbitrage bot", "DEX execution agent", "technical trading analysis", "range trading strategy", "automated trading signals"], description: "Build or run a grid strategy around the market and limits you choose.", auditedIds: ["292939", "266234", "302258", "267697"], art: "/media/categories/grid-trading.jpg" },
  { slug: "yield-optimisation", name: "Yield Optimisation", queries: ["DeFi yield optimisation and farming", "staking and liquidity rewards", "vault APY opportunities", "lending yield and passive returns", "DeFi yield opportunities", "crypto staking agent", "liquidity mining rewards", "DeFi lending returns", "automated vault strategy"], description: "Compare ways to put idle assets to work at a risk level you accept.", auditedIds: ["267698", "3416", "133221"], art: "/media/categories/yield-optimisation.jpg" },
  { slug: "health-factor-monitoring", name: "Health Factor Monitoring", queries: ["DeFi position risk monitoring", "lending liquidation alerts", "collateral and leverage risk", "loan health monitoring", "DeFi risk monitoring", "lending collateral management", "liquidation protection", "portfolio risk alerts", "wallet position monitoring", "DeFi security alerts", "crypto risk analysis", "DeFi lending agent", "collateral analytics", "portfolio monitoring", "financial risk alerts", "asset risk monitoring"], description: "Watch a lending position and warn you before liquidation risk gets too close.", auditedIds: ["292058", "179543"], art: "/media/categories/health-monitoring.jpg" },
];

function hasUsefulProfile(agent: ScanAgentSummary) {
  const name = agent.name?.trim();
  const description = agent.description?.trim();
  return Boolean(name && description && description.length >= 24);
}

function normalizedAgentName(name: string) {
  return name
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\.agent\b/g, "")
    .replace(/(?:agent\s*)?#?\d+$/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function categoryRank(agent: ScanAgentSummary, semanticRank: number) {
  const relevance = agent.similarity_score ?? 1 / Math.log2(semanticRank + 2);
  const reputation = agent.total_feedbacks > 0
    ? Math.min(agent.total_feedbacks, 20) / 20 * Math.max(0, Math.min(agent.average_score, 5)) / 5
    : 0;
  const activity = Math.max(0, Math.min(agent.health_score ?? 0, 100)) / 100;
  const registryQuality = Math.min(Math.log1p(Math.max(agent.total_score ?? 0, 0)) / Math.log(101), 1);
  const serviceEvidence = agent.x402_supported || agent.supported_protocols?.length > 0 ? 1 : 0;
  const endpointTrust = agent.is_endpoint_verified ? 1 : 0;
  const validationTrust = (agent.total_validations ?? 0) > 0
    ? Math.min((agent.successful_validations ?? 0) / Math.max(agent.total_validations ?? 1, 1), 1)
    : 0;
  const indexedQuality = Math.max(0, Math.min(agent.quality_score ?? 0, 100)) / 100;
  const indexedActivity = Math.max(0, Math.min(agent.activity_score ?? 0, 100)) / 100;

  // Relevance finds the right job; the remaining signals decide which credible
  // candidates a consumer should see first. Human-audited candidates stay first.
  return relevance * 60
    + registryQuality * 22
    + reputation * 18
    + activity * 10
    + Number(agent.is_verified) * 8
    + endpointTrust * 8
    + validationTrust * 6
    + indexedQuality * 6
    + indexedActivity * 4
    + serviceEvidence * 2
    - Number(agent.is_active === false) * 20;
}

export function rankCategoryAgents(_category: (typeof categories)[number], agents: ScanAgentSummary[]) {
  const unique = [...new Map(agents.map((agent) => [agent.token_id, agent])).values()];
  const semanticMatches = unique.filter((agent) => typeof agent.similarity_score === "number");

  const scored = semanticMatches
    .map((agent, semanticRank) => ({ agent, score: categoryRank(agent, semanticRank) + (hasUsefulProfile(agent) ? 6 : 0) }))
    .sort((a, b) => b.score - a.score || b.agent.total_score - a.agent.total_score);

  const seenNames = new Set<string>();
  const diverse: typeof scored = [];
  for (const candidate of scored) {
    const name = normalizedAgentName(candidate.agent.name);
    if (name && seenNames.has(name)) continue;
    if (name) seenNames.add(name);
    diverse.push(candidate);
  }

  return diverse.slice(0, CATEGORY_DISPLAY_DEPTH).map(({ agent }) => agent);
}

export const auditedAgentIds = ["265375", "293054", "45650", "292939", "266234", "302258", "267697", "267698", "3416", "133221", "292058", "179543"];

export const auditedStatus: Record<string, { label: string; tone: "success" | "warning" | "muted"; note: string }> = {
  "265375": { label: "Hireability candidate", tone: "success", note: "Healthy A2A card with explicit ERC-8183 negotiation instructions; no verified AgentDB hire yet." },
  "302258": { label: "Needs verification", tone: "warning", note: "Callable service and pricing observed, but the response is not a conforming A2A AgentCard." },
  "266234": { label: "Offline", tone: "warning", note: "Endpoint responded during the audit but reported OFFLINE with no skills." },
  "292939": { label: "Endpoint unavailable", tone: "warning", note: "Advertised populated endpoint returned HTTP 404 during the audit." },
  "292058": { label: "Endpoint unavailable", tone: "warning", note: "Strong category fit; advertised populated endpoint returned HTTP 404 during the audit." },
  "179543": { label: "Commerce unproven", tone: "muted", note: "A2A profile responded, with no verified ERC-8183 or pricing evidence." },
};
