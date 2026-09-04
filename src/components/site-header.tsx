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
          <Link href="/agents">Browse agents</Link>
          <Link href="/#outcomes">What agents do</Link>
          <Link href="/tasks">Jobs</Link>
        </nav>
      </div>
    </header>
  );
}
