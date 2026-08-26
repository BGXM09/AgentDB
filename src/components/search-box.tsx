export function SearchBox({ defaultValue = "", compact = false }: { defaultValue?: string; compact?: boolean }) {
  return <form className={`universal-search ${compact ? "compact" : ""}`} action="/search">
    <label className="sr-only" htmlFor={compact ? "site-search" : "hero-search"}>Search agents</label>
    <input id={compact ? "site-search" : "hero-search"} name="q" defaultValue={defaultValue} placeholder="Search by agent, ERC-8004 ID, address, capability or protocol" />
    <button type="submit" aria-label="Search">Search</button>
  </form>;
}
