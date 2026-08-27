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
          <Link href="/">Home</Link>
          <Link href="/agents">
            Agents{" "}
            <svg className="nav-caret" viewBox="0 0 10 6" aria-hidden="true">
              <path d="m1 1 4 4 4-4" />
            </svg>
          </Link>
          <Link href="/tasks">
            Tasks{" "}
            <svg className="nav-caret" viewBox="0 0 10 6" aria-hidden="true">
              <path d="m1 1 4 4 4-4" />
            </svg>
          </Link>
          <Link href="/activity">Activity</Link>
          <Link href="/leaderboard">Leaderboard</Link>
        </nav>
        <WalletControl />
      </div>
    </header>
  );
}
