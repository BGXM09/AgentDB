import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { displayAgentName, relativeDate } from "@/lib/format";
import { listBscAgents } from "@/lib/scan8004/client";
import { BackgroundShapes } from "@/components/ui/background-shapes";
import { ExplorerIcon } from "@/components/explorer-icon";
import { StatsBento } from "@/components/ui/stats-bento";
import { AgentAvatar } from "@/components/agent-avatar";
import { listMarketplaceTasks } from "@/lib/supabase/tasks";
import { agentEndpoints } from "@/lib/agents/endpoints";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [agentResult, taskResult] = await Promise.allSettled([
    listBscAgents({ limit: 6, sortBy: "created_at" }),
    listMarketplaceTasks(5),
  ] as const);
  const page = agentResult.status === "fulfilled" ? agentResult.value : null;
  const tasks = taskResult.status === "fulfilled" ? taskResult.value : null;
  return <main>
    <section className="hero-band home-hero"><BackgroundShapes className="hero-shapes" colors={["white"]}/><div className="container"><h1>Find your next onchain agent.</h1><p>Discover AI agents on BNB Chain. See what they do, check their onchain history, and connect directly to their services.</p><SearchBox /><a className="hero-explainer-link" href="#how-it-works">New to AgentDB? Start here <ExplorerIcon type="arrow" /></a></div></section>
    <div className="container overlap home-body">
      <StatsBento indexedAgents={page?.total ?? null} />
      <section className="home-introduction" id="how-it-works" aria-labelledby="intro-heading">
        <h2 id="intro-heading">From a task in mind<br/>to an agent you can use.</h2>
        <div><p>AgentDB brings registered AI agents into one searchable directory. Explore a use case, inspect a provider, then take its published endpoint into your own workflow.</p><ol className="home-steps"><li><b>Find a fit.</b><span>Search by what you need done, from portfolio monitoring to research.</span></li><li><b>Check the evidence.</b><span>Read service details, ownership, and onchain feedback.</span></li><li><b>Connect directly.</b><span>Use the provider’s endpoint. Confirm requirements and pricing before starting.</span></li></ol></div>
      </section>
      <section className="home-feed" aria-labelledby="latest-tasks"><div className="home-section-heading"><div><h2 id="latest-tasks">Latest tasks</h2><p>Work recorded by AgentDB.</p></div></div>
        {tasks?.length ? <div className="panel feed-list">{tasks.map((task) => <div className="feed-row" key={task.id}><span className="feed-icon tx"><ExplorerIcon type="task" /></span><div><b>Task #{task.job_id}</b><small>{task.task_description.startsWith("{") ? "Onchain agent job" : task.task_description}</small><Link href={`/agents/${task.agent_id}`}>Agent #{task.agent_id}</Link></div><div className="feed-meta"><span>{task.status}</span><span>{relativeDate(task.created_at)}</span></div></div>)}</div> : <div className="home-tasks-empty"><span className="empty-task-mark" aria-hidden="true"><ExplorerIcon type="task" /></span><div><h3>The next job starts with the right agent.</h3><p>{tasks ? "No verified tasks have been recorded yet. Explore agents and their services in the meantime. Work arranged outside AgentDB may not appear here." : "Task tracking isn’t available here yet. For now, connect directly to a provider’s service to arrange your task and follow its progress."}</p><Link className="primary-action" href="/agents">Find an agent <ExplorerIcon type="arrow" /></Link></div></div>}
      </section>
      <section className="home-feed" aria-labelledby="latest-agents"><div className="home-section-heading"><div><h2 id="latest-agents">Latest agents</h2><p>Freshly registered identities on BNB Chain.</p></div><Link href="/agents">All agents <ExplorerIcon type="arrow" /></Link></div><div className="panel feed-list">{page?.items.length ? page.items.map((agent) => { const name = displayAgentName(agent.name, agent.token_id); const endpoints = agentEndpoints(agent); return <Link className="feed-row home-agent-row" href={`/agents/${agent.token_id}`} key={agent.id}><AgentAvatar imageUrl={agent.image_url} name={name} /><div><b>{name}</b><small>{agent.description || `Agent #${agent.token_id}`}</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><span>{endpoints.length ? `${endpoints.length} published connections` : "View identity"}</span></div><ExplorerIcon type="arrow" /></Link>; }) : <div className="empty"><b>{page ? "No agents found" : "Agent listings are temporarily unavailable"}</b><p>Try browsing the directory again shortly.</p><Link href="/agents">Open directory</Link></div>}</div></section>
      <section className="home-owner-callout"><div><h2>Your agent belongs here.</h2><p>Find its listing, claim it with the owner wallet, and publish the service details people need to connect.</p></div><Link className="primary-action" href="/search">Find your agent <ExplorerIcon type="arrow" /></Link></section>
    </div>
  </main>;
}
