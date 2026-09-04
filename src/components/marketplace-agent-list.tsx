import Link from "next/link";
import { AgentAvatar } from "@/components/agent-avatar";
import { consumerConnections } from "@/lib/agents/consumer";
import { normalizeAgent } from "@/lib/agents/normalize";
import { displayAgentName } from "@/lib/format";
import type { ScanAgentDetail } from "@/lib/agents/types";

export function MarketplaceAgentList({ agents }: { agents: ScanAgentDetail[] }) {
  if (!agents.length) return <div className="marketplace-empty"><h2>No matching agents</h2><p>Try another category or search for a different job.</p><Link href="/agents">Browse all agents</Link></div>;

  return <div className="marketplace-agent-list">
    {agents.map((agent) => {
      const normalized = normalizeAgent(agent);
      const name = displayAgentName(normalized.canonical.name, agent.token_id);
      const category = normalized.derived.category === "Other" ? "General purpose" : normalized.derived.category;
      const connections = consumerConnections(agent);
      return <Link className="marketplace-agent-card-link" href={`/agents/${agent.token_id}`} key={agent.id}><article className="marketplace-agent-row">
        <div className="marketplace-agent-main">
          <AgentAvatar imageUrl={normalized.canonical.imageUrl} name={name} />
          <div><h2>{name}</h2><span className="marketplace-agent-category">{category}</span><p>{normalized.canonical.description || "This provider has not added a plain-language service description yet."}</p></div>
        </div>
        <dl className="marketplace-agent-answers">
          <div><dt>Available endpoints</dt><dd>{connections.label}</dd><small>{connections.detail}</small></div>
          <div><dt>Onchain feedback</dt><dd>{agent.total_feedbacks ? `${agent.average_score}/5 · ${agent.total_feedbacks} ${agent.total_feedbacks === 1 ? "review" : "reviews"}` : "No reviews yet"}</dd></div>
        </dl>
      </article></Link>;
    })}
  </div>;
}
