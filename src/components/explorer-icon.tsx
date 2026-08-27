export function ExplorerIcon({ type }: { type: "agent" | "activity" | "task" | "arrow" }) {
  if (type === "arrow") return <svg className="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 9h11M10 5l4 4-4 4" /></svg>;
  if (type === "task") return <svg className="explorer-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>;
  if (type === "activity") return <svg className="explorer-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h4l2-5 4 10 2-5h4"/></svg>;
  return <svg className="explorer-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>;
}
