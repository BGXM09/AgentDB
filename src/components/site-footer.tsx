import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="container footer-top">
        <span>Built for the BNB agent economy</span>
        <a href="#top">Back to Top ↑</a>
      </div>
      <div className="container footer-grid">
        <div>
          <Link
            className="footer-brand wordmark"
            href="/"
            aria-label="AgentDB home"
          >
            <span>Agent</span>
            <span className="wordmark-db">DB</span>
          </Link>
          <p>
            AgentDB is a marketplace for discovering, evaluating and hiring
            onchain agents.
          </p>
        </div>
        <div>
          <b>Explorer</b>
          <Link href="/agents">Agents</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/activity">Activity</Link>
        </div>
        <div>
          <b>Resources</b>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/search">Search</Link>
          <p>BSC Mainnet</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>AgentDB © 2026</span>
        <span>Explore. Verify. Hire.</span>
      </div>
    </footer>
  );
}
