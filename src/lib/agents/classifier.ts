import type { AgentCategory, ScanAgentDetail } from "./types";

const rules: Array<{ category: AgentCategory; terms: RegExp[] }> = [
  { category: "Health Factor Monitoring", terms: [/health.?factor/i, /liquidat/i, /position (?:protection|risk|monitor)/i, /collateral (?:health|risk|monitor)/i, /lending risk/i, /leverage risk/i, /risk alert/i] },
  { category: "Grid Trading", terms: [/grid trad/i, /grid strateg/i, /grid order/i, /market.?mak/i, /limit order/i, /trading bot/i, /algorithmic trad/i, /trading automat/i] },
  { category: "Rebalancing", terms: [/rebalanc/i, /liquidity (?:range|position|management)/i, /lp range/i, /concentrated liquidity/i, /portfolio (?:allocation|management)/i, /asset allocation/i] },
  { category: "Yield Optimisation", terms: [/yield optimi[sz]/i, /yield farm/i, /best (?:apr|apy)/i, /highest (?:apr|apy)/i, /yield rout/i, /staking reward/i, /liquidity reward/i, /yield vault/i, /lending yield/i, /passive (?:yield|return)/i] },
];

const broadRules: Array<{ category: AgentCategory; terms: RegExp[] }> = [
  { category: "Security & Risk", terms: [/security/i, /audit/i, /threat/i, /fraud/i, /compliance/i, /vulnerab/i, /risk analy/i] },
  { category: "Trading & Markets", terms: [/trad(?:e|ing)/i, /market.?mak/i, /market (?:data|analysis|signal)/i, /arbitrage/i, /swap/i, /price (?:feed|analysis|alert)/i, /technical analysis/i] },
  { category: "Data & Analytics", terms: [/analytics/i, /data analy/i, /insight/i, /oracle/i, /index(?:er|ing)/i, /reporting/i] },
  { category: "Developer Tools", terms: [/developer/i, /code (?:review|generation)/i, /github/i, /smart contract/i, /devops/i, /debug/i, /software test/i] },
  { category: "Content & Research", terms: [/research/i, /content/i, /social media/i, /news/i, /writ(?:e|ing)/i, /marketing/i, /summari[sz]/i] },
  { category: "Commerce & Payments", terms: [/payment/i, /commerce/i, /x402/i, /invoice/i, /checkout/i, /billing/i, /purchase/i] },
  { category: "Automation", terms: [/automation/i, /workflow/i, /orchestrat/i, /schedul/i, /task management/i] },
  { category: "DeFi & Finance", terms: [/defi/i, /financ/i, /lending/i, /staking/i, /crypto/i, /token/i, /wallet/i, /investment/i] },
  { category: "General Assistant", terms: [/assistant/i, /chatbot/i, /concierge/i, /customer support/i, /general purpose/i] },
];

export function classifyAgent(agent: Pick<ScanAgentDetail, "name" | "description" | "supported_protocols" | "services" | "endpoints" | "metadata" | "tags">) {
  const text = [agent.name, agent.description, ...(agent.tags ?? []), ...(agent.supported_protocols ?? []), JSON.stringify(agent.services ?? ""), JSON.stringify(agent.endpoints ?? ""), JSON.stringify(agent.metadata ?? "")].filter(Boolean).join(" ");
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
  for (const rule of broadRules) {
    const evidence = rule.terms.filter((term) => term.test(text)).map((term) => term.source);
    if (evidence.length) {
      return {
        category: rule.category,
        confidence: evidence.length > 1 || (agent.tags?.length ?? 0) > 0 ? "high" as const : "medium" as const,
        evidence,
      };
    }
  }
  return { category: "Other" as const, confidence: "low" as const, evidence: [] };
}
