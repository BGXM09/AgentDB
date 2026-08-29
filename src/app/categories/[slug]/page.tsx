import { notFound } from "next/navigation";
import { AgentTable } from "@/components/agent-table";
import { categories } from "@/lib/agents/catalog";
import { searchBscAgentCategory } from "@/lib/scan8004/client";
import { hireableStudioAgents } from "@/lib/agents/marketplace";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const page = await searchBscAgentCategory(category.queries, 100);
  const agents = await hireableStudioAgents(page.items);
  return <main className="container page-content"><div className="page-heading"><div><h1>{category.name}</h1><p>{category.description}</p></div><span className="count-pill">{agents.length} available</span></div><section className="panel table-panel"><div className="panel-title"><h2>Ready to hire</h2><span>Live commerce detected</span></div><AgentTable agents={agents} showCategory={false}/></section></main>;
}
