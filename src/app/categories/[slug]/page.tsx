import { notFound } from "next/navigation";
import { MarketplaceAgentList } from "@/components/marketplace-agent-list";
import { categories, CATEGORY_DISPLAY_DEPTH } from "@/lib/agents/catalog";
import { getConsumerCategory } from "@/lib/agents/consumer";
import { searchBscAgentCategory } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const page = await searchBscAgentCategory(category.queries, 100);
  const copy = getConsumerCategory(category.name);
  const items = [...page.items].sort((a, b) => Number(category.auditedIds.includes(b.token_id)) - Number(category.auditedIds.includes(a.token_id)) || b.total_score - a.total_score).slice(0, CATEGORY_DISPLAY_DEPTH);
  return <main className="container page-content marketplace-page"><section className="category-hero"><div><h1>{copy.action}</h1><strong>{category.description}</strong></div></section><div className="marketplace-results-heading"><h2>Best matches</h2><span>{items.length} agents</span></div><MarketplaceAgentList agents={items}/></main>;
}
