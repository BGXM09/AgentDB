export function StatusBadge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "success" | "warning" | "danger" | "info" | "muted" }) {
  return <span className={`status ${tone}`}>{children}</span>;
}
