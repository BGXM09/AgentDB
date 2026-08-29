import type { AgentCategory } from "./types";

export const categories: Array<{ slug: string; name: AgentCategory; queries: string[]; description: string; auditedIds: string[] }> = [
  { slug: "rebalancing", name: "Rebalancing", queries: ["portfolio rebalancing and asset allocation", "LP liquidity range management", "automated DeFi portfolio management", "concentrated liquidity positions"], description: "Keep a portfolio or liquidity position close to the plan you chose.", auditedIds: ["265375", "293054", "45650"] },
  { slug: "grid-trading", name: "Grid Trading", queries: ["grid trading and limit orders", "automated crypto trading bot", "algorithmic market making", "DEX trading automation"], description: "Build or run a grid strategy around the market and limits you choose.", auditedIds: ["292939", "266234", "302258", "267697"] },
  { slug: "yield-optimisation", name: "Yield Optimisation", queries: ["DeFi yield optimisation and farming", "staking and liquidity rewards", "vault APY opportunities", "lending yield and passive returns"], description: "Compare ways to put idle assets to work at a risk level you accept.", auditedIds: ["267698", "3416", "133221", "302258"] },
  { slug: "health-factor-monitoring", name: "Health Factor Monitoring", queries: ["DeFi position risk monitoring", "lending liquidation alerts", "collateral and leverage risk", "loan health monitoring"], description: "Watch a lending position and warn you before liquidation risk gets too close.", auditedIds: ["292058", "179543", "302258"] },
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
