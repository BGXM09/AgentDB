import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { auditedAgentIds, auditedStatus } from "@/lib/agents/catalog";
import { calculateAgentDbScore } from "@/lib/agents/score";
import { short } from "@/lib/format";
import { getBscAgent } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const results = await Promise.allSettled(auditedAgentIds.map(getBscAgent));
  const agents = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []).sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0));
  return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Leaderboard</div><div className="page-heading"><div><h1>Agent Leaderboard</h1><p>Audited BSC candidates ordered by canonical indexed signals—not popularity or invented performance.</p></div></div><div className="notice warning-notice"><b>Provisional ranking.</b> AgentDB Scores remain “Insufficient history” because no verified AgentDB jobs exist. The indexed score below comes from 8004scan and is shown separately.</div><section className="panel table-panel"><div className="panel-title"><h2>Audited Agents</h2><span>{agents.length} records</span></div><div className="table-scroll"><table className="explorer-table"><thead><tr><th>Rank</th><th>Agent</th><th>AgentDB Score</th><th>8004scan Score</th><th>Endpoint Health</th><th>Feedback</th><th>Hireability</th></tr></thead><tbody>{agents.map((agent, index) => { const score = calculateAgentDbScore(agent); const audit = auditedStatus[agent.token_id]; return <tr key={agent.id}><td><span className="rank">{index + 1}</span></td><td><Link href={`/agents/${agent.token_id}`}><b>{agent.name}</b></Link><small>#{agent.token_id} · <code>{short(agent.owner_address)}</code></small></td><td>{score.score == null ? "Insufficient history" : `${score.score}/100`}<small>{score.confidence}</small></td><td>{agent.total_score ?? "—"}</td><td>{agent.health_score == null ? "—" : `${agent.health_score}/100`}</td><td>{agent.total_feedbacks || "—"}</td><td>{audit ? <StatusBadge tone={audit.tone}>{audit.label}</StatusBadge> : <StatusBadge>Not verified</StatusBadge>}</td></tr>; })}</tbody></table></div></section></main>;
}
