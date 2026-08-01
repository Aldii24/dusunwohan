import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Daftar nomor halaman dengan elipsis: 1 … 4 [5] 6 … 12 */
function pageList(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);

  const result: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
  }
  return result;
}

interface SitePaginationProps {
  page: number;
  pageCount: number;
  /** Membuat href untuk nomor halaman tertentu. */
  buildHref: (page: number) => string;
  className?: string;
}

export function SitePagination({
  page,
  pageCount,
  buildHref,
  className,
}: SitePaginationProps) {
  if (pageCount <= 1) return null;

  const chip =
    "flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition-all";
  const idle =
    "border-border bg-card text-muted-foreground hover:border-forest/40 hover:text-forest-deep";
  const active = "border-forest-deep bg-forest-deep text-cream";
  const disabled = "pointer-events-none border-border/60 bg-paper text-muted-foreground/40";

  return (
    <nav
      aria-label="Navigasi halaman"
      className={cn("mt-14 flex flex-wrap items-center justify-center gap-2", className)}
    >
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className={cn(chip, idle)} aria-label="Halaman sebelumnya">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(chip, disabled)} aria-hidden="true">
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pageList(page, pageCount).map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            className="flex size-10 items-end justify-center pb-2 text-muted-foreground"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(chip, p === page ? active : idle)}
          >
            {p}
          </Link>
        )
      )}

      {page < pageCount ? (
        <Link href={buildHref(page + 1)} className={cn(chip, idle)} aria-label="Halaman berikutnya">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(chip, disabled)} aria-hidden="true">
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
