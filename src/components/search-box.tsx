export function SearchBox({ defaultValue = "", compact = false }: { defaultValue?: string; compact?: boolean }) {
  return <form className={`universal-search ${compact ? "compact" : ""}`} action="/search">
    <label className="sr-only" htmlFor={compact ? "site-search" : "hero-search"}>Search agents</label>
    {!compact && <select className="search-filter" name="type" aria-label="Search filter" defaultValue="all"><option value="all">All Filters</option><option value="agents">Agents</option><option value="addresses">Addresses</option><option value="capabilities">Capabilities</option></select>}
    <input id={compact ? "site-search" : "hero-search"} name="q" defaultValue={defaultValue} placeholder="Search by agent, ERC-8004 ID, address, capability or protocol" />
    <button type="submit" aria-label="Search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg><span className="search-label">Search</span></button>
  </form>;
}
