import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentAvatar } from "@/components/agent-avatar";
import { AgentConnections } from "@/components/agent-connections";
import { agentEndpoints } from "@/lib/agents/endpoints";
import { normalizeAgent } from "@/lib/agents/normalize";
import { absoluteDate, displayAgentName, short } from "@/lib/format";
import { getBscAgent, Scan8004Error } from "@/lib/scan8004/client";
import { getVerifiedClaim } from "@/lib/supabase/claims";

export const dynamic = "force-dynamic";

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const agent = await getBscAgent(id).catch((error: unknown) => {
    if (error instanceof Scan8004Error && error.status === 404) notFound();
    throw error;
  });
  const normalized = normalizeAgent(agent);
  const claim = await getVerifiedClaim(id, agent.contract_address, agent.owner_address);
  const displayName = displayAgentName(agent.name, id);
  const endpoints = agentEndpoints(agent);
  const txHash = typeof agent.created_tx_hash === "string" ? agent.created_tx_hash : null;
  return <main className="container page-content agent-storefront">
    <div className="breadcrumb"><Link href="/agents">Agents</Link><span>/</span>{displayName}</div>
    <div className="agent-profile-bento streamlined-profile">
      <section className="agent-storefront-hero">
        <div className="agent-storefront-identity"><AgentAvatar imageUrl={agent.image_url} name={displayName} large /><div><span>{normalized.derived.category === "Other" ? "General purpose" : normalized.derived.category}</span><h1>{displayName}</h1><p>{agent.description || "The provider has not published a description yet."}</p></div></div>
        <div className="agent-storefront-cta"><small>Agent #{id} · BNB Chain{claim ? " · Owner claimed" : ""}</small><div className="agent-hero-actions">{endpoints.length > 0 && <a className="primary-action" href="#connect">Use this agent</a>}<Link className="claim-agent-action" href={`/agents/${id}/claim`}>{claim ? "Manage agent" : "Own this agent?"}</Link></div></div>
      </section>
      <AgentConnections endpoints={endpoints} />
      <section className="agent-reviews-section"><div><h2>Onchain feedback</h2><p>{agent.total_feedbacks ? `${agent.average_score}/5 · ${agent.total_feedbacks} recorded ${agent.total_feedbacks === 1 ? "entry" : "entries"}` : "No feedback recorded yet."}</p></div><p>{agent.total_feedbacks ? "Feedback comes from the ERC-8004 network. It is not independently verified as a review of a paid AgentDB task." : "Registration confirms an identity exists. It does not establish the quality or reliability of its service."}</p></section>
      <details className="agent-technical-details"><summary>Identity & registration <span aria-hidden="true">+</span></summary><div><dl><div><dt>Agent ID</dt><dd>#{agent.token_id}</dd></div><div><dt>Owner</dt><dd><code>{agent.owner_address}</code></dd></div><div><dt>Registry</dt><dd><code>{agent.contract_address}</code></dd></div><div><dt>Created</dt><dd>{absoluteDate(agent.created_at)}</dd></div><div><dt>Protocols</dt><dd>{agent.supported_protocols?.join(", ") || "None declared"}</dd></div><div><dt>Registration</dt><dd>{txHash ? <a target="_blank" rel="noreferrer" href={`https://bscscan.com/tx/${txHash}`}>{short(txHash, 14, 10)}</a> : "Unavailable"}</dd></div></dl><details><summary>View indexed record</summary><pre className="raw-record">{JSON.stringify(agent, null, 2)}</pre></details></div></details>
    </div>
  </main>;
}
