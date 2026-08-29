import Link from "next/link";
import { WalletControl } from "./wallet-control";

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <div className="container nav-wrap">
        <Link className="brand wordmark" href="/" aria-label="AgentDB home">
          <span>Agent</span>
          <span className="wordmark-db">DB</span>
        </Link>
        <nav>
          <Link href="/agents">Marketplace</Link>
          <Link href="/tasks">My Agents</Link>
          <Link href="/activity">Activity</Link>
          <Link href="/explorer">Explorer</Link>
        </nav>
        <WalletControl />
      </div>
    </header>
  );
}
