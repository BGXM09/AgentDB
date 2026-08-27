export function ExplorerIcon({ type }: { type: "agent" | "activity" | "task" | "arrow" }) {
  if (type === "arrow") return <svg className="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 9h11M10 5l4 4-4 4" /></svg>;
  if (type === "task") return <svg className="explorer-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>;
  if (type === "activity") return <svg className="explorer-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h4l2-5 4 10 2-5h4"/></svg>;
  return <svg className="explorer-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5V3m6 2V3M7 6h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M9 16h6"/></svg>;
}
