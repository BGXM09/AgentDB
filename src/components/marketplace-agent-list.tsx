import Link from "next/link";
import { AgentAvatar } from "@/components/agent-avatar";
import { normalizeAgent } from "@/lib/agents/normalize";
import { displayAgentName } from "@/lib/format";
import type { AgentCategory, ScanAgentDetail } from "@/lib/agents/types";

const resultByCategory: Partial<Record<AgentCategory, string>> = {
  "Rebalancing": "A portfolio or liquidity-position adjustment you can review.",
  "Grid Trading": "A grid strategy or order plan based on the market and limits you provide.",
  "Yield Optimisation": "A comparison of yield opportunities with a recommended next step.",
  "Health Factor Monitoring": "A risk check or alert when a lending position moves toward liquidation.",
  "Trading & Markets": "A market analysis, signal, or trading plan based on your request.",
  "DeFi & Finance": "A financial analysis or action plan based on your request.",
  "Security & Risk": "A risk finding or security assessment you can act on.",
  "Data & Analytics": "A structured analysis with findings from the data you provide.",
  "Developer Tools": "Code, a technical review, or a development task result.",
  "Content & Research": "A written research or content deliverable.",
  "Commerce & Payments": "A payment or commerce workflow result.",
  "Automation": "A completed or configured workflow for the task you describe.",
  "General Assistant": "A response or completed task based on your instructions.",
};

function trustSummary(agent: ScanAgentDetail) {
  if (agent.total_feedbacks > 0) return `${agent.average_score}/5 from ${agent.total_feedbacks} ${agent.total_feedbacks === 1 ? "review" : "reviews"}`;
  if (agent.is_verified) return "Identity verified; no customer reviews yet";
  if ((agent.health_score ?? 0) > 0) return "Service activity detected; no customer reviews yet";
  return "No customer evidence yet";
}

export function MarketplaceAgentList({ agents }: { agents: ScanAgentDetail[] }) {
  if (!agents.length) return <div className="marketplace-empty"><h2>No matching agents</h2><p>Try a broader category or remove an evidence filter.</p><Link href="/agents">Clear filters</Link></div>;

  return <div className="marketplace-agent-list">
    {agents.map((agent) => {
      const normalized = normalizeAgent(agent);
      const name = displayAgentName(normalized.canonical.name, agent.token_id);
      const category = normalized.derived.category === "Other" ? "General purpose" : normalized.derived.category;
      const result = resultByCategory[normalized.derived.category] ?? "The provider has not described a standard deliverable yet.";
      const price = normalized.derived.commerce === "erc-8183" ? "Live quote" : normalized.derived.commerce === "x402" ? "Pay per request" : "Not listed";

      return <article className="marketplace-agent-row" key={agent.id}>
        <div className="marketplace-agent-main">
          <AgentAvatar imageUrl={normalized.canonical.imageUrl} name={name} />
          <div><span className="marketplace-agent-category">{category}</span><h2>{name}</h2><p>{normalized.canonical.description || "This provider has not added a plain-language service description yet."}</p></div>
        </div>
        <dl className="marketplace-agent-answers">
          <div><dt>What you receive</dt><dd>{result}</dd></div>
          <div><dt>Price</dt><dd>{price}</dd></div>
          <div><dt>Delivery time</dt><dd>Not listed</dd></div>
          <div><dt>Why trust it</dt><dd>{trustSummary(agent)}</dd></div>
        </dl>
        <div className="marketplace-agent-action"><Link href={`/agents/${agent.token_id}`}>View agent</Link></div>
      </article>;
    })}
  </div>;
}
