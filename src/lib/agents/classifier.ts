import type { AgentCategory, ScanAgentDetail } from "./types";

const rules: Array<{ category: AgentCategory; terms: RegExp[] }> = [
  { category: "Health Factor Monitoring", terms: [/health.?factor/i, /liquidat/i, /position (?:protection|risk|monitor)/i, /collateral (?:health|risk|monitor)/i, /lending risk/i, /leverage risk/i, /risk alert/i] },
  { category: "Grid Trading", terms: [/grid trad/i, /grid strateg/i, /grid order/i, /market.?mak/i, /limit order/i, /trading bot/i, /algorithmic trad/i, /trading automat/i] },
  { category: "Rebalancing", terms: [/rebalanc/i, /liquidity (?:range|position|management)/i, /lp range/i, /concentrated liquidity/i, /portfolio (?:allocation|management)/i, /asset allocation/i] },
  { category: "Yield Optimisation", terms: [/yield optimi[sz]/i, /yield farm/i, /best (?:apr|apy)/i, /highest (?:apr|apy)/i, /yield rout/i, /staking reward/i, /liquidity reward/i, /yield vault/i, /lending yield/i, /passive (?:yield|return)/i] },
];

export function classifyAgent(agent: Pick<ScanAgentDetail, "name" | "description" | "supported_protocols" | "services" | "endpoints" | "metadata">) {
  const text = [agent.name, agent.description, ...(agent.supported_protocols ?? []), JSON.stringify(agent.services ?? ""), JSON.stringify(agent.endpoints ?? ""), JSON.stringify(agent.metadata ?? "")].filter(Boolean).join(" ");
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
