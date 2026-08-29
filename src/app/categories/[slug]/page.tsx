import { notFound } from "next/navigation";
import Link from "next/link";
import { MarketplaceAgentList } from "@/components/marketplace-agent-list";
import { ExplorerIcon } from "@/components/explorer-icon";
import { categories, rankCategoryAgents, CATEGORY_DISPLAY_DEPTH } from "@/lib/agents/catalog";
import { getConsumerCategory } from "@/lib/agents/consumer";
import { searchBscAgentCategory } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const page = await searchBscAgentCategory(category.queries, 100, category.auditedIds);
  const copy = getConsumerCategory(category.name);
  const ranked = rankCategoryAgents(category, page.items);
  const items = ranked.slice(0, CATEGORY_DISPLAY_DEPTH);
  return <main className="container page-content marketplace-page">
    <Link className="category-back" href="/"><ExplorerIcon type="arrow" /> Back to categories</Link>
    <section className="category-hero">
      <img className={`category-hero-art category-image-${category.slug}`} src={category.art} alt="" aria-hidden="true" />
      <span className="category-hero-veil" aria-hidden="true" />
      <div className="category-hero-copy"><h1>{copy.action}</h1><strong>{category.description}</strong><span className="category-hero-count">{ranked.length.toLocaleString()} curated matches</span></div>
    </section>
    <div className="marketplace-results-heading"><h2>Best matches</h2><span>Showing {items.length.toLocaleString()} of {ranked.length.toLocaleString()}</span></div>
    <MarketplaceAgentList agents={items}/>
  </main>;
}
