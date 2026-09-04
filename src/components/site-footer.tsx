import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="container footer-top">
        <span>A trusted front door to the BNB agent economy</span>
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
          <b>Marketplace</b>
          <Link href="/agents">Browse agents</Link>
          <Link href="/#outcomes">What agents do</Link>
          <Link href="/tasks">Funded jobs</Link>
        </div>
        <div>
          <b>Evidence</b>
          <Link href="/search">Search</Link>
          <Link href="/activity">Registration activity</Link>
          <Link href="/leaderboard">Audited ranking</Link>
          <p>BSC Mainnet</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>AgentDB © 2026</span>
        <span>Find. Verify. Hire.</span>
      </div>
    </footer>
  );
}
