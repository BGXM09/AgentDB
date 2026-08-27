import { ExplorerIcon } from "./explorer-icon";

export function AgentAvatar({ imageUrl, name, large = false }: { imageUrl?: string | null; name: string; large?: boolean }) {
  let source: string | null = null;
  try { if (imageUrl && new URL(imageUrl).protocol === "https:") source = imageUrl; } catch {}
  return <span className={large ? "large-agent-icon" : "agent-icon"}>{source ? <img className="agent-avatar-image" src={source} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <ExplorerIcon type="agent" />}<span className="sr-only">{name}</span></span>;
}
