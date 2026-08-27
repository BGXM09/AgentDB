"use client";

import { BackgroundShapes } from "./background-shapes";

interface StatsBentoProps {
  indexedAgents: number;
}

export const StatsBento = ({ indexedAgents }: StatsBentoProps) => {
  return (
    <section className="stats-bento" aria-label="AgentDB registry statistics">
      <div className="stats-bento-primary">
        <BackgroundShapes
          className="stats-bento-shapes"
          width={620}
          height={300}
          cellSize={28}
          strokeWidth={8}
          colors={["white"]}
          interval={3600}
        />
        <div>
          <span className="stats-bento-label inverted">Indexed agents</span>
          <h2>{indexedAgents.toLocaleString()}</h2>
        </div>
        <p>Live ERC-8004 identities indexed on BNB Smart Chain.</p>
      </div>
      <div className="stats-bento-wide">
        <div>
          <span className="stats-bento-label">Registry coverage</span>
          <strong>Indexed identities</strong>
          <small>Illustrative activity pattern</small>
        </div>
        <div className="registry-bars" aria-hidden="true">
          {[42, 64, 50, 78, 58, 88, 70, 95, 76, 100, 86].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
        </div>
      </div>
      <div className="stats-bento-small">
        <strong>56</strong>
        <span className="stats-bento-label">Chain ID</span>
      </div>
      <div className="stats-bento-medium">
        <span className="stats-bento-mark" aria-hidden="true">B</span>
        <div><strong>BNB Mainnet</strong><span>Active network</span></div>
      </div>
      <div className="stats-bento-small availability">
        <strong className="unavailable">Not available</strong>
        <span className="stats-bento-label">Verified hires</span>
      </div>
    </section>
  );
};

export default StatsBento;
