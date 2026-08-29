import Link from "next/link";
import { WalletControl } from "./wallet-control";

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <svg className="nav-geometry" viewBox="0 0 1200 64" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="46" cy="20" r="5" fill="currentColor" stroke="none" />
          <path d="M90 16h24M90 24h24M90 32h24" />
          <path d="m154 16 18 18m0-18-18 18" />
          <rect x="222" y="15" width="20" height="20" />
          <path d="m282 35 22-22" />
          <circle cx="906" cy="22" r="5" fill="currentColor" stroke="none" />
          <path d="M954 16h24M954 24h24M954 32h24" />
          <path d="m1026 16 18 18m0-18-18 18" />
          <rect x="1090" y="15" width="20" height="20" />
          <path d="m1150 35 22-22" />
        </g>
      </svg>
      <div className="container nav-wrap">
        <Link className="brand wordmark" href="/" aria-label="AgentDB home">
          <span>Agent</span>
          <span className="wordmark-db">DB</span>
        </Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/agents">Agents</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/activity">Activity</Link>
          <Link href="/leaderboard">Leaderboard</Link>
        </nav>
        <WalletControl />
      </div>
    </header>
  );
}
