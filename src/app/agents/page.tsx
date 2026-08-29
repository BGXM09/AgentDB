import Link from "next/link";
import { MarketplaceAgentList } from "@/components/marketplace-agent-list";
import { SearchBox } from "@/components/search-box";
import { categories } from "@/lib/agents/catalog";
import type { ScanAgentDetail, ScanAgentSummary } from "@/lib/agents/types";
import { listBscAgents, searchBscAgentCategory } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

type MarketplaceParams = { offset?: string; category?: string; evidence?: string; sort?: string };

export default async function AgentsPage({ searchParams }: { searchParams: Promise<MarketplaceParams> }) {
  const params = await searchParams;
  const offset = Math.max(0, Number(params.offset) || 0);
  const category = categories.find((item) => item.slug === params.category);
  const evidence = params.evidence === "reviewed" || params.evidence === "service" ? params.evidence : "all";
  const sort = params.sort === "newest" || params.sort === "reviewed" ? params.sort : "recommended";
  const pageSize = 20;

  let items: ScanAgentSummary[];
  let total: number;
  if (category) {
    const categoryPage = await searchBscAgentCategory(category.queries, 100);
    let matches = categoryPage.items;
    if (evidence === "reviewed") matches = matches.filter((agent) => agent.total_feedbacks > 0);
    if (evidence === "service") matches = matches.filter((agent) => Boolean(agent.a2a_endpoint || agent.services || agent.supported_protocols?.length));
    matches.sort((a, b) => sort === "newest" ? Date.parse(b.created_at) - Date.parse(a.created_at) : sort === "reviewed" ? b.total_feedbacks - a.total_feedbacks : b.total_score - a.total_score);
    total = matches.length;
    items = matches.slice(offset, offset + pageSize);
  } else {
    const page = await listBscAgents({
      limit: pageSize,
      offset,
      sortBy: sort === "newest" ? "created_at" : sort === "reviewed" ? "total_feedbacks" : "total_score",
      minFeedbacks: evidence === "reviewed" ? 1 : undefined,
      hasA2a: evidence === "service" || undefined,
    });
    items = page.items;
    total = page.total;
  }

  const query = new URLSearchParams();
  if (category) query.set("category", category.slug);
  if (evidence !== "all") query.set("evidence", evidence);
  if (sort !== "recommended") query.set("sort", sort);
  const pageHref = (nextOffset: number) => { const next = new URLSearchParams(query); if (nextOffset > 0) next.set("offset", String(nextOffset)); return `/agents${next.size ? `?${next}` : ""}`; };
  const first = total === 0 ? 0 : offset + 1;
  const last = Math.min(offset + items.length, total);

  return <main className="container page-content marketplace-page">
    <div className="page-heading"><div><h1>Find an agent for the job</h1><p>Compare what agents do, what they deliver, and the evidence behind them.</p></div><span className="count-pill">{total.toLocaleString()} matches</span></div>
    <SearchBox compact />
    <form className="marketplace-filters" action="/agents">
      <label>Category<select name="category" defaultValue={category?.slug ?? ""}><option value="">All categories</option>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
      <label>Evidence<select name="evidence" defaultValue={evidence}><option value="all">Any evidence</option><option value="reviewed">Has customer reviews</option><option value="service">Has a live service</option></select></label>
      <label>Sort by<select name="sort" defaultValue={sort}><option value="recommended">Best supported</option><option value="reviewed">Most reviewed</option><option value="newest">Newest</option></select></label>
      <button type="submit">Apply filters</button>
      {(category || evidence !== "all" || sort !== "recommended") && <Link href="/agents">Clear</Link>}
    </form>
    <div className="marketplace-results-heading"><h2>Agents</h2><span>Showing {first.toLocaleString()}–{last.toLocaleString()} of {total.toLocaleString()}</span></div>
    <MarketplaceAgentList agents={items as ScanAgentDetail[]} />
    {total > pageSize && <nav className="pagination" aria-label="Agent results pages"><Link aria-disabled={offset === 0} href={pageHref(Math.max(0, offset - pageSize))}>Previous</Link><span>Page {Math.floor(offset / pageSize) + 1}</span><Link aria-disabled={last >= total} href={pageHref(offset + pageSize)}>Next</Link></nav>}
  </main>;
}
