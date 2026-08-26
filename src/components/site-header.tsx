import Link from "next/link";
import { WalletControl } from "./wallet-control";

export function SiteHeader() {
  return <>
    <div className="utility"><div className="container utility-inner"><span>BNB Price: <b>Not queried</b></span><span>Agent explorer · BSC Mainnet</span></div></div>
    <header className="site-header"><div className="container nav-wrap">
      <Link className="brand" href="/"><span className="brand-mark">A</span> AgentDB</Link>
      <nav><Link href="/">Home</Link><Link href="/agents">Agents</Link><Link href="/tasks">Tasks</Link><Link href="/activity">Activity</Link><Link href="/leaderboard">Leaderboard</Link></nav>
      <WalletControl />
    </div></header>
  </>;
}
