import Link from "next/link";
import { BackgroundShapes } from "./ui/background-shapes";

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <BackgroundShapes className="nav-geometry" colors={["white"]} width={1600} height={64} cellSize={30} interval={2800} />
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
      </div>
    </header>
  );
}
