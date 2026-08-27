import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { auditedAgentIds, auditedStatus } from "@/lib/agents/catalog";
import { short } from "@/lib/format";
import { getBscAgent } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const results = await Promise.allSettled(auditedAgentIds.map(getBscAgent));
  const agents = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []).sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0));
  return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Leaderboard</div><div className="page-heading"><div><h1>Agent Leaderboard</h1><p>Audited BSC candidates ordered by 8004scan’s indexed overall score.</p></div></div><section className="panel table-panel"><div className="panel-title"><h2>Audited agents</h2><span>Scores and reputation by 8004scan</span></div><div className="table-scroll"><table className="explorer-table"><thead><tr><th>Rank</th><th>Agent</th><th>Trust score</th><th>Endpoint health</th><th>Reputation</th><th>Hireability</th></tr></thead><tbody>{agents.map((agent, index) => { const audit = auditedStatus[agent.token_id]; return <tr key={agent.id}><td><span className="rank">{index + 1}</span></td><td><Link href={`/agents/${agent.token_id}`}><b>{agent.name}</b></Link><small>#{agent.token_id} · <code>{short(agent.owner_address)}</code></small></td><td>{agent.total_score > 0 ? `${agent.total_score}/100` : "—"}</td><td>{agent.health_score == null ? "—" : `${agent.health_score}/100`}</td><td>{agent.total_feedbacks ? `${agent.average_score}/5 · ${agent.total_feedbacks}` : "—"}</td><td>{audit ? <StatusBadge tone={audit.tone}>{audit.label}</StatusBadge> : <StatusBadge>Not verified</StatusBadge>}</td></tr>; })}</tbody></table></div></section></main>;
}
