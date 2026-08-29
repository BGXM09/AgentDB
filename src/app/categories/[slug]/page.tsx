import { notFound } from "next/navigation";
import Link from "next/link";
import { MarketplaceAgentList } from "@/components/marketplace-agent-list";
import { categories } from "@/lib/agents/catalog";
import { getConsumerCategory } from "@/lib/agents/consumer";
import { searchBscAgentCategory } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const page = await searchBscAgentCategory(category.queries, 100);
  const copy = getConsumerCategory(category.name);
  const items = [...page.items].sort((a, b) => Number(category.auditedIds.includes(b.token_id)) - Number(category.auditedIds.includes(a.token_id)) || b.total_score - a.total_score);
  return <main className="container page-content marketplace-page"><div className="breadcrumb"><Link href="/agents">Agents</Link><span>/</span>{category.name}</div><section className="category-hero"><div><p>Find an agent to</p><h1>{copy.action.toLowerCase()}</h1><strong>{category.description}</strong></div><Link href={`/agents?category=${category.slug}`}>Compare with filters →</Link></section><div className="marketplace-results-heading"><h2>Best matches</h2><span>{page.total.toLocaleString()} found</span></div><MarketplaceAgentList agents={items}/></main>;
}
