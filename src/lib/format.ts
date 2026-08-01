export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function formatDate(iso: string | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  }).format(new Date(iso));
}

export function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(iso))
    .replace(".", ":");
}

export function formatEventRange(startsAt: string, endsAt: string | null): string {
  const date = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(startsAt));
  const start = formatTime(startsAt);
  if (!endsAt) return `${date} · ${start} WIB`;
  return `${date} · ${start}–${formatTime(endsAt)} WIB`;
}

/** Bagian tanggal untuk kartu agenda: { day: "17", month: "Agu" } */
export function dateParts(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("id-ID", { day: "numeric" }).format(d),
    month: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(d),
  };
}

/**
 * ISO string → nilai untuk <input type="datetime-local"> dalam zona WIB.
 * Dipakai form admin agar tanggal konsisten Asia/Jakarta di server mana pun.
 */
export function toDatetimeLocalWIB(iso: string | null | undefined): string {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** Nilai datetime-local (dianggap WIB) → ISO string UTC. */
export function fromDatetimeLocalWIB(value: string): string | null {
  if (!value) return null;
  return new Date(`${value}:00+07:00`).toISOString();
}

export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} menit baca`;
}
