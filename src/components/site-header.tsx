import Link from "next/link";
import { WalletControl } from "./wallet-control";
import { BrandMark } from "./brand-mark";

export function SiteHeader() {
  return <header className="site-header" id="top"><div className="container nav-wrap">
      <Link className="brand" href="/"><BrandMark /> AgentDB</Link>
      <nav><Link href="/">Home</Link><Link href="/agents">Agents <svg className="nav-caret" viewBox="0 0 10 6" aria-hidden="true"><path d="m1 1 4 4 4-4" /></svg></Link><Link href="/tasks">Tasks <svg className="nav-caret" viewBox="0 0 10 6" aria-hidden="true"><path d="m1 1 4 4 4-4" /></svg></Link><Link href="/activity">Activity</Link><Link href="/leaderboard">Leaderboard</Link></nav>
      <WalletControl />
    </div></header>;
}
