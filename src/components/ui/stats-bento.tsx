import Link from "next/link";
import { categories } from "@/lib/agents/catalog";

interface StatsBentoProps {
  indexedAgents: number;
  categoryCounts: Record<string, number>;
}

export const StatsBento = ({ indexedAgents, categoryCounts }: StatsBentoProps) => {
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
      </Link>

      {categories.map((category) => (
        <Link className="stats-bento-category" href={`/categories/${category.slug}`} key={category.slug}>
          <img className={`category-image category-image-${category.slug}`} src={category.art} alt="" aria-hidden="true" />
          <span className="stats-bento-label">{categoryCounts[category.slug].toLocaleString()} curated matches</span>
          <strong>{category.name}</strong>
        </Link>
      ))}
    </section>
  );
};

export default StatsBento;
