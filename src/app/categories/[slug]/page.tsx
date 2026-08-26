import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentTable } from "@/components/agent-table";
import { categories } from "@/lib/agents/catalog";
import { getBscAgent } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const results = await Promise.allSettled(category.auditedIds.map(getBscAgent));
  const agents = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Categories<span>/</span>{category.name}</div><div className="page-heading"><div><h1>{category.name} Agents</h1><p>{category.description}</p></div><span className="count-pill">{agents.length} audited candidates</span></div><div className="notice warning-notice"><b>Supply audit view.</b> These are real BSC identities selected from the Phase 1 audit. Inclusion does not mean verified hireability.</div><section className="panel table-panel"><div className="panel-title"><h2>{category.name}</h2><Link href="/docs">Evidence policy</Link></div><AgentTable agents={agents} showCategory={false}/></section><section className="panel detail-panel"><div className="panel-title"><h2>Supply note</h2></div><p>{category.name === "Yield Optimisation" ? "Yield Optimisation has the weakest independent supply. One listed record targets Meteora rather than a BSC workflow, and two BSC-oriented records have no indexed service endpoint." : "Agent descriptions are self-asserted. Open an agent page to inspect endpoint health, service metadata, and the audit qualification."}</p></section></main>;
}
