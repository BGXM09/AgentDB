import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { StatusBadge } from "@/components/status-badge";
import { hydrateAgents } from "@/lib/agents/load";
import { displayAgentName, relativeDate, short } from "@/lib/format";
import { listBscAgents } from "@/lib/scan8004/client";
import { BackgroundShapes } from "@/components/ui/background-shapes";
import { ExplorerIcon } from "@/components/explorer-icon";
import { StatsBento } from "@/components/ui/stats-bento";
import { AgentTable } from "@/components/agent-table";
import { AgentAvatar } from "@/components/agent-avatar";

export const dynamic = "force-dynamic";

export default async function Home() {
  const page = await listBscAgents({ limit: 50 });
  const agents = await hydrateAgents(page.items, 8);
  const popularAgents = [...page.items].sort((a, b) => (b.total_feedbacks - a.total_feedbacks) || (b.star_count - a.star_count) || (b.total_score - a.total_score)).slice(0, 4);
  return <main>
    <section className="hero-band"><BackgroundShapes className="hero-shapes" colors={["white"]}/><div className="container"><h1>Find your next onchain agent.</h1><SearchBox /></div></section>
    <div className="container overlap">
      <StatsBento indexedAgents={page.total} />
      <section className="popular-agents"><div className="section-heading"><div><h2>Popular agents</h2><p>Agents drawing the strongest indexed marketplace engagement.</p></div><Link href="/agents">Browse marketplace</Link></div><AgentTable agents={popularAgents} /></section>
      <section className="split-panels">
        <div className="panel"><div className="panel-title"><h2>Latest Agents</h2><Link href="/agents">View all agents</Link></div><div className="feed-list">{agents.slice(0, 6).map((agent) => { const name = displayAgentName(agent.name, agent.token_id); return <div className="feed-row" key={agent.id}><AgentAvatar imageUrl={agent.image_url} name={name} /><div><Link href={`/agents/${agent.token_id}`}><b>{name}</b></Link><small>Agent #{agent.token_id}</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><code>{short(agent.owner_address)}</code></div></div>; })}</div><Link className="panel-footer" href="/agents">View all agents <ExplorerIcon type="arrow" /></Link></div>
        <div className="panel"><div className="panel-title"><h2>Latest Tasks / Activity</h2><Link href="/activity">View activity</Link></div><div className="feed-list">{agents.slice(0, 5).map((agent) => <div className="feed-row" key={agent.id}><span className="feed-icon tx"><ExplorerIcon type="activity" /></span><div><Link href={`/agents/${agent.token_id}`}><b>Agent #{agent.token_id} registered</b></Link><small>Confirmed ERC-8004 registration</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><StatusBadge tone="info">Registration</StatusBadge></div></div>)}<div className="feed-row empty-row"><span className="feed-icon tx"><ExplorerIcon type="task" /></span><div><b>No verified task data available</b><small>Task activity appears only after a verified mediated job.</small></div></div></div><Link className="panel-footer" href="/tasks">Open Task Explorer <ExplorerIcon type="arrow" /></Link></div>
      </section>
    </div>
  </main>;
}
