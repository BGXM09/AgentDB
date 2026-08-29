import type { AgentCategory, ScanAgentSummary } from "./types";
import { classifyConsumerCategories } from "./classifier";

export const CATEGORY_DISPLAY_DEPTH = 12;

export const categories: Array<{ slug: string; name: AgentCategory; queries: string[]; description: string; auditedIds: string[]; art: string }> = [
  { slug: "rebalancing", name: "Rebalancing", queries: ["portfolio rebalancing and asset allocation", "LP liquidity range management", "automated DeFi portfolio management", "concentrated liquidity positions"], description: "Keep a portfolio or liquidity position close to the plan you chose.", auditedIds: ["265375", "293054", "45650"], art: "/media/categories/rebalancing.jpg" },
  { slug: "grid-trading", name: "Grid Trading", queries: ["grid trading and limit orders", "automated crypto trading bot", "algorithmic market making", "DEX trading automation"], description: "Build or run a grid strategy around the market and limits you choose.", auditedIds: ["292939", "266234", "302258", "267697"], art: "/media/categories/grid-trading.jpg" },
  { slug: "yield-optimisation", name: "Yield Optimisation", queries: ["DeFi yield optimisation and farming", "staking and liquidity rewards", "vault APY opportunities", "lending yield and passive returns"], description: "Compare ways to put idle assets to work at a risk level you accept.", auditedIds: ["267698", "3416", "133221"], art: "/media/categories/yield-optimisation.jpg" },
  { slug: "health-factor-monitoring", name: "Health Factor Monitoring", queries: ["DeFi position risk monitoring", "lending liquidation alerts", "collateral and leverage risk", "loan health monitoring"], description: "Watch a lending position and warn you before liquidation risk gets too close.", auditedIds: ["292058", "179543"], art: "/media/categories/health-monitoring.jpg" },
];

function hasUsefulProfile(agent: ScanAgentSummary) {
  const name = agent.name?.trim();
  const description = agent.description?.trim();
  return Boolean(name && description && description.length >= 24);
}

function categoryRank(category: (typeof categories)[number], agent: ScanAgentSummary, semanticRank: number, evidenceCount: number) {
  const audit = auditedStatus[agent.token_id];
  const auditWeight = audit?.tone === "success" ? 80 : audit?.tone === "warning" ? 10 : audit ? 5 : category.auditedIds.includes(agent.token_id) ? 20 : 0;
  const relevance = 1 / Math.log2(semanticRank + 2);
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
  return auditWeight
    + relevance * 40
    + registryQuality * 22
    + reputation * 18
    + activity * 10
    + Number(agent.is_verified) * 8
    + endpointTrust * 8
    + validationTrust * 6
    + indexedQuality * 6
    + indexedActivity * 4
    + Math.min(evidenceCount, 3) * 16
    + serviceEvidence * 2
    - Number(agent.is_active === false) * 20;
}

export function rankCategoryAgents(category: (typeof categories)[number], agents: ScanAgentSummary[]) {
  const unique = [...new Map(agents.map((agent) => [agent.token_id, agent])).values()];
  const qualified = unique.flatMap((agent) => {
    const classification = classifyConsumerCategories(agent).find((item) => item.category === category.name);
    const audited = category.auditedIds.includes(agent.token_id);
    const semanticCandidate = typeof agent.similarity_score === "number";
    if (!hasUsefulProfile(agent) && !audited) return [];
    if (!classification && !audited && !semanticCandidate) return [];
    return [{ agent, evidenceCount: classification?.evidence.length ?? 0 }];
  });

  const scored = qualified
    .map(({ agent, evidenceCount }, semanticRank) => ({ agent, score: categoryRank(category, agent, semanticRank, evidenceCount) }))
    .sort((a, b) => b.score - a.score || b.agent.total_score - a.agent.total_score);

  const seenNames = new Set<string>();
  const diverse: typeof scored = [];
  const repeated: typeof scored = [];
  for (const candidate of scored) {
    const name = candidate.agent.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
    if (name && seenNames.has(name)) repeated.push(candidate);
    else {
      if (name) seenNames.add(name);
      diverse.push(candidate);
    }
  }

  return [...diverse, ...repeated].slice(0, CATEGORY_DISPLAY_DEPTH).map(({ agent }) => agent);
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
