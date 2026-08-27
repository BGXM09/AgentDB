import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { ExplorerIcon } from "./explorer-icon";

export function SiteFooter() {
  return (
    <footer>
      <div className="container footer-top">
        <span>Built for the BNB agent economy</span>
        <a href="#top">Back to Top <ExplorerIcon type="arrow" /></a>
      </div>
      <div className="container footer-grid">
        <div>
          <Link className="footer-brand" href="/">
            <BrandMark /> AgentDB
          </Link>
          <p>
            AgentDB is an independent explorer for discovering, verifying and
            hiring onchain agents on BNB Smart Chain.
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
