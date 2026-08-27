import Link from "next/link";
import { categories } from "@/lib/agents/catalog";

interface StatsBentoProps {
  indexedAgents: number;
}

const categoryArt: Record<string, string> = {
  rebalancing: "╭──────╮\n│  ↗ ↘ │\n╰──┬───╯\n   └──→",
  "grid-trading": "┌─┬─┬─┐\n├─┼●┼─┤\n├●┼─┼●┤\n└─┴─┴─┘",
  "yield-optimisation": "      ╱╲\n   ╱╲╱  ╲\n ╱╲  ╱  ↗\n╱__╲╱____╲",
  "health-factor-monitoring": "╭────────╮\n│ ─╲╱╲── │\n│     ╲╱ │\n╰────────╯",
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
          <pre className="category-ascii" aria-hidden="true">{categoryArt[category.slug]}</pre>
          <span className="stats-bento-label">Agent category</span>
          <strong>{category.name}</strong>
          <span className="category-action">Browse agents <span aria-hidden="true">→</span></span>
        </Link>
      ))}
    </section>
  );
};

export default StatsBento;
