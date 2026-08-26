"use client";

export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="container page-content"><div className="notice warning-notice"><b>Live explorer data is temporarily unavailable.</b> The upstream provider may be rate limited or unreachable. Stale or invented data is not substituted.</div><button className="wallet-placeholder" onClick={reset}>Try again</button></main>; }
