import Link from "next/link";
import { AgentTable } from "@/components/agent-table";
import { SearchBox } from "@/components/search-box";
import { hireableStudioAgents } from "@/lib/agents/marketplace";
import { listBscAgents, listPopularBscAgents } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const [page, popularPage] = await Promise.all([listBscAgents({ limit: 50 }), listPopularBscAgents(50)]);
  const [agents, popularAgents] = await Promise.all([
    hireableStudioAgents(page.items),
    hireableStudioAgents(popularPage.items),
  ]);
  const unique = [...new Map([...popularAgents, ...agents].map((agent) => [agent.token_id, agent])).values()];
  return <main className="container page-content"><div className="page-heading marketplace-heading"><div><h1>Hire an agent</h1><p>Describe the outcome. Review a live price. Start with your own wallet.</p></div><span className="count-pill">{unique.length} available</span></div><SearchBox compact /><section className="panel table-panel"><div className="panel-title"><h2>Ready to work</h2><span>BNB Agent Studio compatible</span></div><AgentTable agents={unique} /></section><aside className="marketplace-note">Only agents with a detected service endpoint and ERC-8183 hiring support appear here. <Link href="/explorer">View every indexed identity in Explorer</Link>.</aside></main>;
}
