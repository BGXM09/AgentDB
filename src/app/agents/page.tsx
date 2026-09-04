import Link from "next/link";
import { MarketplaceAgentList } from "@/components/marketplace-agent-list";
import { SearchBox } from "@/components/search-box";
import { categories, CATEGORY_DISPLAY_DEPTH, rankCategoryAgents } from "@/lib/agents/catalog";
import { getConsumerCategory } from "@/lib/agents/consumer";
import type { ScanAgentDetail, ScanAgentSummary } from "@/lib/agents/types";
import { listBscAgents, searchBscAgentCategory } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

type MarketplaceParams = { offset?: string; category?: string };

export default async function AgentsPage({ searchParams }: { searchParams: Promise<MarketplaceParams> }) {
  const params = await searchParams;
  const category = categories.find((item) => item.slug === params.category);
  const offset = category ? 0 : Math.max(0, Number(params.offset) || 0);
  const pageSize = CATEGORY_DISPLAY_DEPTH;

  let items: ScanAgentSummary[];
  let total: number;
  if (category) {
    const categoryPage = await searchBscAgentCategory(category.queries, 100);
    const matches = rankCategoryAgents(category, categoryPage.items);
    total = matches.length;
    items = matches.slice(offset, offset + pageSize);
  } else {
    const page = await listBscAgents({
      limit: pageSize,
      offset,
      sortBy: "total_score",
    });
    items = page.items;
    total = page.total;
  }

  const query = new URLSearchParams();
  if (category) query.set("category", category.slug);
  const pageHref = (nextOffset: number) => { const next = new URLSearchParams(query); if (nextOffset > 0) next.set("offset", String(nextOffset)); return `/agents${next.size ? `?${next}` : ""}`; };
  const first = total === 0 ? 0 : offset + 1;
  const last = Math.min(offset + items.length, total);

  return <main className="container page-content marketplace-page">
    <div className="page-heading marketplace-intro"><div><h1>What do you want done?</h1><p>Choose a job, compare the result, then put the right agent to work.</p></div><span className="count-pill">{total.toLocaleString()} matches</span></div>
    <nav className="job-picker" aria-label="Choose a job">
      {categories.map((item) => { const copy = getConsumerCategory(item.name); return <Link className={category?.slug === item.slug ? "active" : ""} href={`/agents?category=${item.slug}`} key={item.slug}><div><b>{copy.action}</b><small>{copy.promise}</small></div></Link>; })}
    </nav>
    <SearchBox compact />
    <div className="marketplace-results-heading"><h2>{category ? `${category.name} agents` : "Published agents"}</h2><span>{first.toLocaleString()}–{last.toLocaleString()} of {total.toLocaleString()}</span></div>
    <MarketplaceAgentList agents={items as ScanAgentDetail[]} />
    {total > pageSize && <nav className="pagination" aria-label="Agent results pages"><Link aria-disabled={offset === 0} href={pageHref(Math.max(0, offset - pageSize))}>Previous</Link><span>Page {Math.floor(offset / pageSize) + 1}</span><Link aria-disabled={last >= total} href={pageHref(offset + pageSize)}>Next</Link></nav>}
  </main>;
}
