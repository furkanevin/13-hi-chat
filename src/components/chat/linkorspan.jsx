function isLikelyUrl(text) {
  const t = String(text).trim();
  const candidate = /^https?:\/\//i.test(t) ? t : t.startsWith("www.") ? "https://" + t : t;
  try {
    const u = new URL(candidate);
    return ["http:", "https:"].includes(u.protocol) && /\./.test(u.hostname);
  } catch {
    return false;
  }
}

export default function LinkOrSpan({ text, ...props }) {
  const t = String(text).trim();

  if (isLikelyUrl(t)) {
    const href = /^https?:\/\//i.test(t) ? t : t.startsWith("www.") ? "https://" + t : "https://" + t;

    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} className="underline">
        {t}
      </a>
    );
  }

  return <span {...props}>{t}</span>;
}
