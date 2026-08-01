import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("size-10", className)}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="14" fill="var(--forest-deep)" />
      <circle cx="45" cy="18" r="7" fill="var(--gold)" />
      <path
        d="M8 46 L20 26 L28 39 L36 26 L44 39 L52 30 L58 40"
        fill="none"
        stroke="var(--cream)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 54 h48"
        stroke="var(--gold)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-3" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-semibold tracking-tight",
            inverted ? "text-cream" : "text-forest-deep"
          )}
        >
          Dusun Wohan
        </span>
        <span
          className={cn(
            "mt-1 text-[0.65rem] font-medium uppercase tracking-[0.18em]",
            inverted ? "text-cream/60" : "text-muted-foreground"
          )}
        >
          Tampingan · Tegalrejo · Magelang
        </span>
      </span>
    </Link>
  );
}
