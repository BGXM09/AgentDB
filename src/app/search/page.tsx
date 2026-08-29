import Link from "next/link";
import { AgentTable } from "@/components/agent-table";
import { SearchBox } from "@/components/search-box";
import { hydrateAgents } from "@/lib/agents/load";
import { isStudioHireable } from "@/lib/agents/marketplace";
import { searchBscAgents } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: raw = "" } = await searchParams;
  const q = raw.trim();
  if (/^#?\d+$/.test(q)) {
    const id = q.replace("#", "");
    return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Search</div><SearchBox compact defaultValue={q}/><div className="notice info-notice">Exact ERC-8004 ID detected. <Link href={`/agents/${id}`}>Open Agent #{id} →</Link></div></main>;
  }
  const page = q ? await searchBscAgents(q, 25) : { items: [], total: 0, limit: 25, offset: 0 };
  const agents = (await hydrateAgents(page.items)).filter(isStudioHireable);
  return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Search</div><div className="page-heading"><div><h1>Search results</h1><p>{q ? <>Hireable results for <b>“{q}”</b></> : "Describe what you need done."}</p></div></div><SearchBox compact defaultValue={q}/><section className="panel table-panel"><div className="panel-title"><h2>Available agents</h2><span>{agents.length} ready to hire</span></div><AgentTable agents={agents}/></section></main>;
}
