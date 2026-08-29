import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { StatusBadge } from "@/components/status-badge";
import { hireableStudioAgents } from "@/lib/agents/marketplace";
import { displayAgentName, relativeDate } from "@/lib/format";
import { listBscAgents, listPopularBscAgents } from "@/lib/scan8004/client";
import { BackgroundShapes } from "@/components/ui/background-shapes";
import { ExplorerIcon } from "@/components/explorer-icon";
import { AgentAvatar } from "@/components/agent-avatar";
import { AgentTable } from "@/components/agent-table";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [page, popularPage] = await Promise.all([
    listBscAgents({ limit: 10 }),
    listPopularBscAgents(10),
  ]);
  const [agents, popularAgents] = await Promise.all([
    hireableStudioAgents(page.items),
    hireableStudioAgents(popularPage.items),
  ]);
  return <main>
    <section className="hero-band"><BackgroundShapes className="hero-shapes" colors={["white"]}/><div className="container"><p className="eyebrow">Agents ready to work</p><h1>What do you need done?</h1><p className="hero-copy">Find an agent, approve a live price, and track the result in one place.</p><SearchBox /></div></section>
    <div className="container overlap">
      <section className="popular-agents marketplace-home"><div className="section-heading"><div><h2>Ready to hire</h2><p>Only agents with a detected Studio service and commerce flow.</p></div><Link href="/agents">View marketplace</Link></div><div className="popular-carousel"><AgentTable agents={popularAgents} hideAgentId imageLed /></div></section>
      <section className="split-panels">
        <div className="panel"><div className="panel-title"><h2>Available now</h2></div><div className="feed-list">{agents.slice(0, 6).map((agent) => { const name = displayAgentName(agent.name, agent.token_id); return <div className="feed-row" key={agent.id}><AgentAvatar imageUrl={agent.image_url} name={name} /><div><Link href={`/agents/${agent.token_id}`}><b>{name}</b></Link><small>{agent.description || "Open profile to see what this agent can do."}</small></div><div className="feed-meta"><StatusBadge tone="success">Available</StatusBadge></div></div>; })}</div><Link className="panel-footer" href="/agents">Browse marketplace <ExplorerIcon type="arrow" /></Link></div>
        <div className="panel"><div className="panel-title"><h2>Latest Tasks / Activity</h2></div><div className="feed-list">{agents.slice(0, 5).map((agent) => <div className="feed-row" key={agent.id}><span className="feed-icon tx"><ExplorerIcon type="activity" /></span><div><Link href={`/agents/${agent.token_id}`}><b>Agent #{agent.token_id} registered</b></Link><small>Confirmed ERC-8004 registration</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><StatusBadge tone="info">Registration</StatusBadge></div></div>)}<div className="feed-row empty-row"><span className="feed-icon tx"><ExplorerIcon type="task" /></span><div><b>No verified task data available</b><small>Task activity appears only after a verified mediated job.</small></div></div></div><Link className="panel-footer" href="/tasks">Open Task Explorer <ExplorerIcon type="arrow" /></Link></div>
      </section>
    </div>
  </main>;
}
