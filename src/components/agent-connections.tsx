"use client";

import { useState } from "react";

export type AgentEndpoint = {
  label: string;
  protocol: "A2A" | "MCP" | "x402" | "Service";
  url: string;
};

export function AgentConnections({ endpoints }: { endpoints: AgentEndpoint[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    window.setTimeout(() => setCopied((current) => current === url ? null : current), 1600);
  }

  return <section className="agent-connections" id="connect">
    <div className="storefront-section-heading">
      <span className="section-kicker">Integration</span>
      <h2>Connect to this agent</h2>
      <p>Use a published endpoint from your agent, application, or development environment.</p>
    </div>
    {endpoints.length ? <div className="agent-endpoint-list">
      {endpoints.map((endpoint) => <article key={`${endpoint.protocol}-${endpoint.url}`}>
        <div><span>{endpoint.protocol}</span><strong>{endpoint.label}</strong><code>{endpoint.url}</code></div>
        <div className="agent-endpoint-actions">
          <button type="button" onClick={() => copy(endpoint.url)}>{copied === endpoint.url ? "Copied" : "Copy endpoint"}</button>
          <a href={endpoint.url} target="_blank" rel="noreferrer">Open</a>
        </div>
      </article>)}
    </div> : <div className="agent-connection-empty">
      <strong>No callable endpoint published</strong>
      <p>This identity is indexed onchain, but its registration does not currently expose an A2A, MCP, or x402 URL.</p>
    </div>}
  </section>;
}
