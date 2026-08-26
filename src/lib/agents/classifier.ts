import type { AgentCategory, ScanAgentSummary } from "./types";

const rules: Array<{ category: AgentCategory; terms: RegExp[] }> = [
  { category: "Health Factor Monitoring", terms: [/health.?factor/i, /liquidat/i, /position protection/i, /collateral monitor/i] },
  { category: "Grid Trading", terms: [/grid trad/i, /grid strateg/i, /grid order/i] },
  { category: "Rebalancing", terms: [/rebalanc/i, /liquidity range/i, /lp range/i, /concentrated liquidity/i] },
  { category: "Yield Optimisation", terms: [/yield optimi[sz]/i, /yield farm/i, /best (?:apr|apy)/i, /highest (?:apr|apy)/i, /yield rout/i] },
];

export function classifyAgent(agent: Pick<ScanAgentSummary, "name" | "description" | "supported_protocols">) {
  const text = [agent.name, agent.description, ...(agent.supported_protocols ?? [])].filter(Boolean).join(" ");
  for (const rule of rules) {
    const evidence = rule.terms.filter((term) => term.test(text)).map((term) => term.source);
    if (evidence.length) {
      return {
        category: rule.category,
        confidence: evidence.length > 1 ? "high" as const : "medium" as const,
        evidence,
      };
    }
  }
  return { category: "Other" as const, confidence: "low" as const, evidence: [] };
}
