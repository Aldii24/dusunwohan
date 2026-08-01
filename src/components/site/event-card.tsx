import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { DusunEvent } from "@/lib/types";
import { dateParts, formatEventRange } from "@/lib/format";
import { cn } from "@/lib/utils";

export function EventCard({
  event,
  past = false,
}: {
  event: DusunEvent;
  past?: boolean;
}) {
  const { day, month } = dateParts(event.starts_at);

  return (
    <Link
      href={`/agenda/${event.slug}`}
      className={cn(
        "group flex gap-5 rounded-3xl border border-border/80 bg-card p-5 transition-all duration-500 sm:p-6",
        "hover:-translate-y-1 hover:border-forest/30 hover:shadow-[0_20px_40px_-24px_rgb(28_43_34_/_0.35)]",
        past && "opacity-75 hover:opacity-100"
      )}
    >
      <div
        className={cn(
          "flex h-fit w-16 shrink-0 flex-col items-center rounded-2xl py-3 shadow-sm sm:w-20",
          past ? "bg-secondary text-forest-deep" : "bg-forest-deep text-cream"
        )}
      >
        <span className="font-display text-2xl font-bold leading-none sm:text-3xl">
          {day}
        </span>
        <span
          className={cn(
            "mt-1 text-[0.65rem] font-bold uppercase tracking-[0.18em]",
            past ? "text-terracotta" : "text-gold"
          )}
        >
          {month}
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="font-display text-lg font-semibold leading-snug text-forest-deep transition-colors group-hover:text-terracotta sm:text-xl">
          {event.title}
        </h3>
        <div className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Clock className="size-3.5 shrink-0 text-terracotta" />
            <span className="truncate">{formatEventRange(event.starts_at, event.ends_at)}</span>
          </p>
          {event.location && (
            <p className="flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0 text-terracotta" />
              <span className="truncate">{event.location}</span>
            </p>
          )}
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground/90">
          {event.description}
        </p>
      </div>
    </Link>
  );
}
