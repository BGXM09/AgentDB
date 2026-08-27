import Link from "next/link";
import { categories } from "@/lib/agents/catalog";

interface StatsBentoProps {
  indexedAgents: number;
}

export const StatsBento = ({ indexedAgents }: StatsBentoProps) => {
  return (
    <section className="stats-bento" aria-label="Explore AgentDB">
      <Link className="stats-bento-primary" href="/agents">
        <span className="stats-bento-label inverted">Browse all agents</span>
        <h2>{indexedAgents.toLocaleString()}</h2>
        <strong>Indexed agents</strong>
        <span className="bento-arrow" aria-hidden="true">↗</span>
      </Link>

      {categories.map((category) => (
        <Link className="stats-bento-category" href={`/categories/${category.slug}`} key={category.slug}>
          <span className="stats-bento-label">Agent category</span>
          <strong>{category.name}</strong>
          <span className="category-action">Browse agents <span aria-hidden="true">→</span></span>
        </Link>
      ))}
    </section>
  );
};

export default StatsBento;
