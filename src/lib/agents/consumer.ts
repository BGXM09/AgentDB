import type { AgentCategory, ScanAgentDetail } from "./types";

export type ConsumerCategory = {
  action: string;
  promise: string;
  result: string;
  inputs: string;
};

const copy: Partial<Record<AgentCategory, ConsumerCategory>> = {
  "Rebalancing": {
    action: "Keep my positions balanced",
    promise: "Adjust a portfolio or liquidity range when it drifts from your plan.",
    result: "A recommended rebalance or completed position adjustment you can review.",
    inputs: "Your assets or position, target allocation, and risk limits.",
  },
  "Grid Trading": {
    action: "Run a grid strategy",
    promise: "Build or manage a grid around the market and limits you choose.",
    result: "A grid plan, order set, or completed trading run with a clear summary.",
    inputs: "Your market, price range, budget, and risk limits.",
  },
  "Yield Optimisation": {
    action: "Find better yield",
    promise: "Compare opportunities and help put idle assets to work.",
    result: "A ranked yield comparison and a recommended next step.",
    inputs: "Your asset, amount, time horizon, and risk preference.",
  },
  "Health Factor Monitoring": {
    action: "Protect my loan",
    promise: "Watch a lending position and warn you before liquidation risk gets too close.",
    result: "A live risk check or alert with the action needed to restore safety.",
    inputs: "Your wallet or lending position and the safety level you want.",
  },
};

const fallback: ConsumerCategory = {
  action: "Give an agent a task",
  promise: "Ask an agent to complete work using a service it has published.",
  result: "A result based on the task and requirements you provide.",
  inputs: "A clear task, the result you expect, and any limits the agent should follow.",
};

export function getConsumerCategory(category: AgentCategory) {
  return copy[category] ?? fallback;
}

export function categorySlug(category: AgentCategory) {
  const slugs: Partial<Record<AgentCategory, string>> = {
    "Rebalancing": "rebalancing",
    "Grid Trading": "grid-trading",
    "Yield Optimisation": "yield-optimisation",
    "Health Factor Monitoring": "health-factor-monitoring",
  };
  return slugs[category] ?? "";
}

export function consumerPrice(agent: ScanAgentDetail) {
  if (agent.x402_supported || agent.supported_protocols?.some((item) => item.toLowerCase().includes("x402"))) return "Pay per use";
  if (agent.supported_protocols?.some((item) => item.toLowerCase().includes("8183"))) return "Price shown before payment";
  return "Price not published";
}

export function consumerTrust(agent: ScanAgentDetail) {
  if (agent.total_feedbacks > 0) return `${agent.average_score}/5 from ${agent.total_feedbacks} onchain ${agent.total_feedbacks === 1 ? "review" : "reviews"}`;
  if (agent.is_verified) return "Onchain identity verified; no reviews yet";
  if ((agent.health_score ?? 0) > 0) return "Service activity detected; no reviews yet";
  return "No performance evidence yet";
}
