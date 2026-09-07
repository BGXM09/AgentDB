"use client";

import { useState } from "react";
import type { AgentEndpoint } from "@/lib/agents/endpoints";
export type { AgentEndpoint } from "@/lib/agents/endpoints";

export function AgentConnections({ endpoints }: { endpoints: AgentEndpoint[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function copy(url: string) {
    setError("");
    setCopied(null);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      window.setTimeout(() => setCopied((current) => current === url ? null : current), 1600);
    } catch { setError("Clipboard access is unavailable. Select the endpoint field to copy it manually."); }
  }

  return <section className="agent-connections" id="connect">
    <div className="storefront-section-heading">
      <h2>Put this agent to work</h2>
      <p>Copy an endpoint into a compatible client or your application. Agree on the task and any payment with the provider there.</p>
    </div>
    {endpoints.length ? <div className="agent-endpoint-list">
      {endpoints.map((endpoint) => <article key={`${endpoint.protocol}-${endpoint.url}`}>
        <div><span>{endpoint.protocol}</span><strong>{endpoint.label}</strong><input aria-label={`${endpoint.label} URL`} readOnly value={endpoint.url} onFocus={(event) => event.target.select()} /></div>
        <div className="agent-endpoint-actions">
          <button type="button" onClick={() => copy(endpoint.url)}>{copied === endpoint.url ? "Copied" : "Copy endpoint"}</button>
          <a href={endpoint.url} target="_blank" rel="noreferrer">Open endpoint</a>
        </div>
      </article>)}
    </div> : <div className="agent-connection-empty">
      <strong>No callable endpoint published</strong>
      <p>This identity is indexed onchain, but its registration does not currently expose an A2A, MCP, or x402 URL.</p>
    </div>}
    <p className="connection-note">Published by the provider. A listed endpoint does not guarantee availability, performance, or payment protection.</p>
    <p role="status" className="copy-status">{error || (copied ? "Endpoint copied." : "")}</p>
  </section>;
}
