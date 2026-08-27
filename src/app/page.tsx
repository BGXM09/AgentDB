import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { StatusBadge } from "@/components/status-badge";
import { ExplorerIcon } from "@/components/explorer-icon";
import { categories } from "@/lib/agents/catalog";
import { hydrateAgents } from "@/lib/agents/load";
import { relativeDate, short } from "@/lib/format";
import { listBscAgents } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const page = await listBscAgents({ limit: 10 });
  const agents = await hydrateAgents(page.items, 8);
  return (
    <main>
      <section className="hero-band">
        <div className="container">
          <h1>The BNB Agent Economy Explorer</h1>
          <SearchBox />
          <p className="hero-help">
            <b>AgentDB:</b> Discover real ERC-8004 identities, capabilities and
            onchain activity.
          </p>
        </div>
      </section>
      <div className="container overlap">
        <section className="stats-card">
          <div className="metric-stack">
            <div>
              <span
                className="metric-icon agent-signal"
                aria-hidden="true"
              ></span>
              <p>
                INDEXED BSC AGENTS<b>{page.total.toLocaleString()}</b>
              </p>
            </div>
            <div className="metric-secondary">
              <p>
                NETWORK<b>BNB Smart Chain Mainnet</b>
              </p>
            </div>
          </div>
          <div className="metric-stack">
            <div>
              <span
                className="metric-icon task-signal"
                aria-hidden="true"
              ></span>
              <p>
                AGENTDB TASKS<b>Not available</b>
              </p>
            </div>
            <div className="metric-secondary">
              <p>
                VERIFIED HIRES<b>Not available</b>
              </p>
            </div>
          </div>
          <div className="metric-chart">
            <div className="chart-copy">
              <p>AGENT REGISTRY</p>
              <b>Live index</b>
              <small>ERC-8004 identities</small>
            </div>
            <div className="chart-lines" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>
        </section>
        <section className="split-panels">
          <div className="panel">
            <div className="panel-title">
              <h2>Latest Agents</h2>
              <Link href="/agents">View all agents</Link>
            </div>
            <div className="feed-list">
              {agents.slice(0, 6).map((agent) => (
                <div className="feed-row" key={agent.id}>
                  <span className="feed-icon"><ExplorerIcon type="agent" /></span>
                  <div>
                    <Link href={`/agents/${agent.token_id}`}>
                      <b>{agent.name}</b>
                    </Link>
                    <small>Agent #{agent.token_id}</small>
                  </div>
                  <div className="feed-meta">
                    <span>{relativeDate(agent.created_at)}</span>
                    <code>{short(agent.owner_address)}</code>
                  </div>
                </div>
              ))}
            </div>
            <Link className="panel-footer" href="/agents">
              View all agents <ExplorerIcon type="arrow" />
            </Link>
          </div>
          <div className="panel">
            <div className="panel-title">
              <h2>Latest Tasks / Activity</h2>
              <Link href="/activity">View activity</Link>
            </div>
            <div className="feed-list">
              {agents.slice(0, 5).map((agent) => (
                <div className="feed-row" key={agent.id}>
                  <span className="feed-icon tx"><ExplorerIcon type="activity" /></span>
                  <div>
                    <Link href={`/agents/${agent.token_id}`}>
                      <b>Agent #{agent.token_id} registered</b>
                    </Link>
                    <small>Confirmed ERC-8004 registration</small>
                  </div>
                  <div className="feed-meta">
                    <span>{relativeDate(agent.created_at)}</span>
                    <StatusBadge tone="info">Registration</StatusBadge>
                  </div>
                </div>
              ))}
              <div className="feed-row empty-row">
                <span className="feed-icon tx"><ExplorerIcon type="task" /></span>
                <div>
                  <b>No verified task data available</b>
                  <small>
                    Task activity appears only after a verified mediated job.
                  </small>
                </div>
              </div>
            </div>
            <Link className="panel-footer" href="/tasks">
              Open Task Explorer <ExplorerIcon type="arrow" />
            </Link>
          </div>
        </section>
        <section className="category-strip">
          <div className="section-heading">
            <div>
              <h2>Explore Agent Categories</h2>
              <p>
                Browse real agents by their indexed metadata and capabilities.
              </p>
            </div>
            <Link href="/agents">View all agents</Link>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                href={`/categories/${category.slug}`}
                className="category-tile"
                key={category.slug}
              >
                <span className="category-glyph" aria-hidden="true"></span>
                <span>
                  <b>{category.name}</b>
                  <small>{category.description}</small>
                </span>
                <ExplorerIcon type="arrow" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
