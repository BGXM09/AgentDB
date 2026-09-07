export type AgentEndpoint = {
  label: string;
  protocol: "A2A" | "MCP" | "x402" | "Service";
  url: string;
};

export function publicHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value.trim());
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || !host.includes(".") || host.includes(":")) return null;
    if (/^(0|10|127)\./.test(host) || /^169\.254\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) return null;
    return url.href;
  } catch { return null; }
}

/** Only service containers are inspected; images, documentation and identity links are not endpoints. */
export function agentEndpoints(agent: Record<string, unknown>): AgentEndpoint[] {
  const found = new Map<string, AgentEndpoint>();
  function visit(value: unknown, hint = "") {
    if (typeof value === "string") {
      const url = publicHttpUrl(value);
      if (!url) return;
      const clue = `${hint} ${url}`.toLowerCase();
      const protocol: AgentEndpoint["protocol"] = clue.includes("x402") ? "x402" : clue.includes("mcp") ? "MCP" : /a2a|agent-card|agent\.json/.test(clue) ? "A2A" : "Service";
      const previous = found.get(url);
      if (!previous || previous.protocol === "Service") found.set(url, { protocol, label: protocol === "Service" ? "Web service" : `${protocol} endpoint`, url });
    } else if (Array.isArray(value)) value.forEach((item) => visit(item, hint));
    else if (value && typeof value === "object") {
      const item = value as Record<string, unknown>;
      const label = `${hint} ${typeof item.name === "string" ? item.name : ""} ${typeof item.protocol === "string" ? item.protocol : ""}`;
      for (const [key, child] of Object.entries(item)) {
        if (["image", "icon", "documentation", "docs", "website", "name", "protocol", "description"].includes(key.toLowerCase())) continue;
        visit(child, `${label} ${key}`);
      }
    }
  }
  for (const source of [agent, agent.metadata, agent.raw_metadata]) {
    if (!source || typeof source !== "object") continue;
    const record = source as Record<string, unknown>;
    visit(record.services);
    visit(record.endpoints);
  }
  return [...found.values()];
}
