import Link from "next/link";

export function SiteFooter() {
  return <footer><div className="container footer-grid"><div><b>AgentDB</b><p>Explore. Verify. Hire.</p></div><div><b>Explorer</b><Link href="/agents">Agents</Link><Link href="/tasks">Tasks</Link></div><div><b>Build status</b><p>Phase 2 · read-only</p><p>BSC Mainnet</p></div></div></footer>;
}
