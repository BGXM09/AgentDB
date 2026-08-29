"use client";

import { useState } from "react";
import { ExplorerIcon } from "./explorer-icon";

export function AgentAvatar({ imageUrl, name, large = false, artwork = false }: { imageUrl?: string | null; name: string; large?: boolean; artwork?: boolean }) {
  let source: string | null = null;
  try { if (imageUrl && new URL(imageUrl).protocol === "https:") source = imageUrl; } catch {}
  const [imageAvailable, setImageAvailable] = useState(Boolean(source));
  if (artwork) return source && imageAvailable ? <span className="agent-card-artwork" aria-hidden="true"><img src={source} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setImageAvailable(false)} /></span> : null;
  return <span className={large ? "large-agent-icon" : "agent-icon"}>{source && imageAvailable ? <img className="agent-avatar-image" src={source} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setImageAvailable(false)} /> : <ExplorerIcon type="agent" />}<span className="sr-only">{name}</span></span>;
}
