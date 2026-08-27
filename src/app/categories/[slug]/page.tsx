import { notFound } from "next/navigation";
import { AgentTable } from "@/components/agent-table";
import { categories } from "@/lib/agents/catalog";
import { searchBscAgents } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const page = await searchBscAgents(category.query, 100);
  return <main className="container page-content"><div className="page-heading"><div><h1>{category.name}</h1><p>{category.description}</p></div><span className="count-pill">{page.total.toLocaleString()} matches</span></div><section className="panel table-panel"><div className="panel-title"><h2>Discover agents</h2><span>Top {page.items.length} marketplace matches</span></div><AgentTable agents={page.items} showCategory={false}/></section></main>;
}
