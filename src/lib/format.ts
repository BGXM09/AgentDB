export function short(value?: string | null, front = 8, back = 6) {
  if (!value) return "—";
  return value.length > front + back + 1 ? `${value.slice(0, front)}…${value.slice(-back)}` : value;
}

export function relativeDate(value?: string | null) {
  if (!value) return "—";
  const then = new Date(value).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return `${seconds} secs ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export function absoluteDate(value?: string | null) {
  return value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "medium", timeZone: "UTC" }).format(new Date(value)) + " UTC" : "—";
}
