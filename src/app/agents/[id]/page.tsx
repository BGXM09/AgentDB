import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { auditedStatus } from "@/lib/agents/catalog";
import { normalizeAgent } from "@/lib/agents/normalize";
import { calculateAgentDbScore } from "@/lib/agents/score";
import { absoluteDate, displayAgentName, short } from "@/lib/format";
import { getBscAgent } from "@/lib/scan8004/client";
import { getVerifiedClaim } from "@/lib/supabase/claims";
import { AgentAvatar } from "@/components/agent-avatar";

export const dynamic = "force-dynamic";

function renderServices(value: unknown) {
  if (!value) return <span className="subtle">No service endpoint declared.</span>;
  const entries = Array.isArray(value) ? value.map((item, index) => [String(index + 1), item] as const) : Object.entries(value as Record<string, unknown>);
  return <div className="service-list">{entries.map(([name, service]) => <div className="service-item" key={name}><b>{name.toUpperCase()}</b><pre>{JSON.stringify(service, null, 2)}</pre></div>)}</div>;
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let agent;
  try { agent = await getBscAgent(id); } catch { notFound(); }
  const normalized = normalizeAgent(agent);
  const score = calculateAgentDbScore(agent);
  const audit = auditedStatus[id];
  const txHash = typeof agent.created_tx_hash === "string" ? agent.created_tx_hash : null;
  const claim = await getVerifiedClaim(id, agent.contract_address);
  const displayName = displayAgentName(agent.name, id);
  return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/agents">Agents</Link><span>/</span>Agent #{id}</div>
    <section className="entity-header"><div className="entity-ident"><AgentAvatar imageUrl={agent.image_url} name={displayName} large /><div><div className="title-line"><h1>{displayName}</h1>{agent.is_verified && <StatusBadge tone="success">Verified identity</StatusBadge>}</div><p>Agent #{id} <button className="copy" title="Copy ID">Copy</button></p></div></div><div className="entity-actions"><Link className="secondary-action" href={`/agents/${id}/claim`}>Claim Agent</Link>{id === "265375" && <Link className="primary-action" href={`/agents/${id}/hire`}>Hire Agent</Link>}</div></section>
    {claim && <div className="notice success-notice"><b>Claimed owner ✓</b> AgentDB verified the canonical owner wallet onchain and recorded a signed ownership proof on {absoluteDate(claim.verified_at)}.</div>}
    {audit && <div className={`notice ${audit.tone === "success" ? "success-notice" : "warning-notice"}`}><b>{audit.label}.</b> {audit.note}</div>}
    {!audit && <div className="notice warning-notice"><b>No verified hiring interface detected.</b> Registration alone does not establish hireability.</div>}
    <div className="overview-grid"><section className="panel summary-panel"><div className="panel-title"><h2>Overview</h2></div><dl className="summary-list"><div><dt>Trust signal</dt><dd><details className="score-details"><summary>{score.score} / 100 · {score.confidence} confidence</summary><div className="score-popover">{score.evidence.map((item) => <p key={item.label}><b>{item.label} ({item.weight})</b><span>{item.value}</span></p>)}</div></details></dd></div><div><dt>Category</dt><dd>{normalized.derived.category === "Other" ? "Unclassified" : normalized.derived.category} <small>({normalized.derived.categoryConfidence} confidence)</small></dd></div><div><dt>Reputation</dt><dd>{agent.total_feedbacks ? `${agent.average_score} average · ${agent.total_feedbacks} feedback` : "No ERC-8004 feedback"}</dd></div><div><dt>Endpoint health</dt><dd>{agent.health_score == null ? "No health evidence" : `${agent.health_score}/100`}</dd></div><div><dt>Commerce</dt><dd>{normalized.derived.commerce === "unknown" ? "Not yet available" : normalized.derived.commerce.toUpperCase()}</dd></div></dl></section><section className="panel summary-panel"><div className="panel-title"><h2>More Info</h2></div><dl className="summary-list"><div><dt>Network</dt><dd>BNB Smart Chain (56)</dd></div><div><dt>Owner</dt><dd><code>{agent.owner_address}</code></dd></div><div><dt>Agent wallet</dt><dd><code>{typeof agent.agent_wallet === "string" ? agent.agent_wallet : "Not declared"}</code></dd></div><div><dt>Protocols</dt><dd>{agent.supported_protocols?.join(", ") || "None declared"}</dd></div><div><dt>Updated</dt><dd>{absoluteDate(agent.updated_at)}</dd></div></dl></section></div>
    <nav className="tabs"><a href="#overview">Overview</a><a href="#services">Services</a><a href="#activity">Activity</a><a href="#reviews">Reviews</a><a href="#technical">Technical</a></nav>
    <section className="panel detail-panel" id="overview"><div className="panel-title"><h2>Agent Profile</h2></div><dl className="detail-list"><div><dt>Agent ID:</dt><dd>#{agent.token_id}</dd></div><div><dt>Name:</dt><dd>{agent.name || "No canonical name"}</dd></div><div><dt>Description:</dt><dd>{agent.description || "No description provided."}</dd></div><div><dt>Owner:</dt><dd><code>{agent.owner_address}</code></dd></div><div><dt>Identity Registry:</dt><dd><code>{agent.contract_address}</code></dd></div><div><dt>Registration:</dt><dd>{txHash ? <a target="_blank" rel="noreferrer" href={`https://bscscan.com/tx/${txHash}`}>{short(txHash, 14, 10)}</a> : "Transaction hash unavailable"}</dd></div><div><dt>Created:</dt><dd>{absoluteDate(agent.created_at)}</dd></div></dl></section>
    <section className="panel detail-panel" id="services"><div className="panel-title"><h2>Declared Services</h2><span>Canonical indexed metadata</span></div>{renderServices(agent.services)}</section>
    <section className="panel detail-panel" id="activity"><div className="panel-title"><h2>Activity</h2></div>{txHash ? <div className="semantic-event"><span className="feed-icon tx">R</span><div><b>{agent.name} registered its ERC-8004 identity on BNB Smart Chain.</b><small>Confirmed registration event. No business purpose is inferred.</small></div><a target="_blank" rel="noreferrer" href={`https://bscscan.com/tx/${txHash}`}>View raw transaction on BscScan</a></div> : <div className="empty">No attributable activity available.</div>}</section>
    <section className="panel detail-panel" id="reviews"><div className="panel-title"><h2>Reviews & Feedback</h2></div><div className="empty"><b>No verified AgentDB reviews.</b><p>{agent.total_feedbacks ? `${agent.total_feedbacks} broader ERC-8004 feedback items are indexed but are not AgentDB verified hires.` : "No ERC-8004 feedback is indexed for this agent."}</p></div></section>
    <section className="panel detail-panel" id="technical"><div className="panel-title"><h2>Technical Details</h2></div><details><summary>View raw canonical 8004scan record</summary><pre className="raw-record">{JSON.stringify(agent, null, 2)}</pre></details></section>
  </main>;
}
