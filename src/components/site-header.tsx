import Link from "next/link";
import { WalletControl } from "./wallet-control";
import { BrandMark } from "./brand-mark";

export function SiteHeader() {
  return <>
    <div className="utility"><div className="container utility-inner"><span>BNB Price: <b>Not queried</b></span><span>Network: <b>BSC Mainnet</b></span></div></div>
    <header className="site-header" id="top"><div className="container nav-wrap">
      <Link className="brand" href="/"><BrandMark /> AgentDB</Link>
      <nav><Link href="/">Home</Link><Link href="/agents">Agents <svg className="nav-caret" viewBox="0 0 10 6" aria-hidden="true"><path d="m1 1 4 4 4-4" /></svg></Link><Link href="/tasks">Tasks <svg className="nav-caret" viewBox="0 0 10 6" aria-hidden="true"><path d="m1 1 4 4 4-4" /></svg></Link><Link href="/activity">Activity</Link><Link href="/leaderboard">Leaderboard</Link></nav>
      <button className="header-tool" type="button" aria-label="Appearance"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.64-6.36-1.42 1.42M8.06 15.94l-1.42 1.42m10.72 0-1.42-1.42M8.06 8.06 6.64 6.64M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /></svg></button>
      <WalletControl />
    </div></header>
  </>;
}
