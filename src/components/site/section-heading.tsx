import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  inverted?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Lihat semua",
  align = "left",
  inverted = false,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div
        className={cn(
          "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
          align === "center" && "md:flex-col md:items-center md:text-center"
        )}
      >
        <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
          <p
            className={cn(
              "flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]",
              inverted ? "text-gold" : "text-terracotta",
              align === "center" && "justify-center"
            )}
          >
            <span
              className={cn(
                "h-px w-8",
                inverted ? "bg-gold" : "bg-terracotta"
              )}
            />
            {eyebrow}
            {align === "center" && (
              <span
                className={cn("h-px w-8", inverted ? "bg-gold" : "bg-terracotta")}
              />
            )}
          </p>
          <h2
            className={cn(
              "mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-[2.6rem]",
              inverted ? "text-cream" : "text-forest-deep"
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "mt-4 text-base leading-relaxed",
                inverted ? "text-cream/70" : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className={cn(
              "group inline-flex shrink-0 items-center gap-2 text-sm font-semibold",
              inverted ? "text-gold" : "text-terracotta"
            )}
          >
            <span className="link-grow">{linkLabel}</span>
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </Reveal>
  );
}
