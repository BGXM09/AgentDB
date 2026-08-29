export function SearchBox({ defaultValue = "", compact = false }: { defaultValue?: string; compact?: boolean }) {
  return <form className={`universal-search ${compact ? "compact" : ""}`} action="/search">
    <label className="sr-only" htmlFor={compact ? "site-search" : "hero-search"}>Search agents</label>
    <input id={compact ? "site-search" : "hero-search"} name="q" defaultValue={defaultValue} placeholder="Search agents by name, skill, service or wallet" />
    <button type="submit" aria-label="Look up agents"><span className="search-button-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.75" cy="10.75" r="6.75"/><path d="m15.75 15.75 4.25 4.25"/></svg></span><span className="search-label">LOOKUP</span></button>
  </form>;
}
