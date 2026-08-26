import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { hydrateAgents } from "@/lib/agents/load";
import { absoluteDate, short } from "@/lib/format";
import { listBscAgents } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const page = await listBscAgents({ limit: 25 });
  const agents = await hydrateAgents(page.items);
  return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Activity</div><div className="page-heading"><div><h1>Latest Agent Activity</h1><p>Human-readable events only where attribution is supported by indexed evidence.</p></div></div><div className="notice info-notice"><b>Semantic level A:</b> the events below are confirmed ERC-8004 registrations. AgentDB does not infer what the agent did beyond registration.</div><section className="panel table-panel"><div className="panel-title"><h2>Agent Activity</h2><span>Latest BSC registrations</span></div><div className="table-scroll"><table className="explorer-table"><thead><tr><th>Transaction</th><th>Action</th><th>Agent</th><th>Owner</th><th>Age</th><th>Status</th></tr></thead><tbody>{agents.map((agent) => { const tx = typeof agent.created_tx_hash === "string" ? agent.created_tx_hash : null; return <tr key={agent.id}><td>{tx ? <a href={`https://bscscan.com/tx/${tx}`} target="_blank" rel="noreferrer"><code>{short(tx, 10, 8)}</code> ↗</a> : "—"}</td><td>Registered ERC-8004 identity<small>{absoluteDate(agent.created_at)}</small></td><td><Link href={`/agents/${agent.token_id}`}>{agent.name}</Link><small>#{agent.token_id}</small></td><td><code>{short(agent.owner_address)}</code></td><td>{absoluteDate(agent.created_at)}</td><td><StatusBadge tone="success">Confirmed</StatusBadge></td></tr>; })}</tbody></table></div></section></main>;
}
