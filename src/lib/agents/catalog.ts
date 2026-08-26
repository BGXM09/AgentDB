import type { AgentCategory } from "./types";

export const categories: Array<{ slug: string; name: AgentCategory; query: string; description: string; auditedIds: string[] }> = [
  { slug: "rebalancing", name: "Rebalancing", query: "LP rebalancing liquidity range", description: "Manage LP ranges and reset positions when supported by the agent.", auditedIds: ["265375", "293054", "45650"] },
  { slug: "grid-trading", name: "Grid Trading", query: "grid trading", description: "Plan or manage automated grid orders using declared agent services.", auditedIds: ["292939", "266234", "302258", "267697"] },
  { slug: "yield-optimisation", name: "Yield Optimisation", query: "yield optimisation highest APR", description: "Discover or route liquidity toward yield opportunities.", auditedIds: ["267698", "3416", "133221", "302258"] },
  { slug: "health-factor-monitoring", name: "Health Factor Monitoring", query: "health factor monitoring liquidation protection", description: "Monitor lending risk and liquidation distance.", auditedIds: ["292058", "179543", "302258"] },
];

export const auditedAgentIds = ["265375", "293054", "45650", "292939", "266234", "302258", "267697", "267698", "3416", "133221", "292058", "179543"];

export const auditedStatus: Record<string, { label: string; tone: "success" | "warning" | "muted"; note: string }> = {
  "265375": { label: "Hireability candidate", tone: "success", note: "Healthy A2A card with explicit ERC-8183 negotiation instructions; no verified AgentDB hire yet." },
  "302258": { label: "Needs verification", tone: "warning", note: "Callable service and pricing observed, but the response is not a conforming A2A AgentCard." },
  "266234": { label: "Offline", tone: "warning", note: "Endpoint responded during the audit but reported OFFLINE with no skills." },
  "292939": { label: "Endpoint unavailable", tone: "warning", note: "Advertised populated endpoint returned HTTP 404 during the audit." },
  "292058": { label: "Endpoint unavailable", tone: "warning", note: "Strong category fit; advertised populated endpoint returned HTTP 404 during the audit." },
  "179543": { label: "Commerce unproven", tone: "muted", note: "A2A profile responded, with no verified ERC-8183 or pricing evidence." },
};
