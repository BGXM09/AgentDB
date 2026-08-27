import Link from "next/link";
import { categories } from "@/lib/agents/catalog";

interface StatsBentoProps {
  indexedAgents: number;
}

const categoryArt: Record<string, string> = {
  rebalancing: "/media/categories/rebalancing.jpg",
  "grid-trading": "/media/categories/grid-trading.jpg",
  "yield-optimisation": "/media/categories/yield-optimisation.jpg",
  "health-factor-monitoring": "/media/categories/health-monitoring.jpg",
};

export const StatsBento = ({ indexedAgents }: StatsBentoProps) => {
  return (
    <section className="stats-bento" aria-label="Explore AgentDB">
      <Link className="stats-bento-primary" href="/agents">
        <video className="bento-ascii" autoPlay loop muted playsInline preload="metadata" aria-hidden="true">
          <source src="/media/agent-ascii-wallpaper.mp4" type="video/mp4" />
        </video>
        <span className="bento-ascii-veil" aria-hidden="true" />
        <span className="stats-bento-label inverted">Browse all agents</span>
        <h2>{indexedAgents.toLocaleString()}</h2>
        <strong>Indexed agents</strong>
        <span className="bento-arrow" aria-hidden="true">↗</span>
      </Link>

      {categories.map((category) => (
        <Link className="stats-bento-category" href={`/categories/${category.slug}`} key={category.slug}>
          <img className={`category-image category-image-${category.slug}`} src={categoryArt[category.slug]} alt="" aria-hidden="true" />
          <span className="stats-bento-label">Agent category</span>
          <strong>{category.name}</strong>
          <span className="category-action">Browse agents <span aria-hidden="true">→</span></span>
        </Link>
      ))}
    </section>
  );
};

export default StatsBento;
