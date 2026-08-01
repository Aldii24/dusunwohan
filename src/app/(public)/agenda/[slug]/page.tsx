import type { Metadata } from "next";
import Link from "next/link";
import { ContentImage } from "@/components/site/content-image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { Markdown } from "@/components/site/markdown";
import { getEventBySlug } from "@/lib/data";
import { dateParts, formatEventRange } from "@/lib/format";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Agenda tidak ditemukan" };
  return { title: event.title, description: event.description.slice(0, 150) };
}

export default async function AgendaDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const { day, month } = dateParts(event.starts_at);
  const isPast = new Date(event.starts_at) < new Date();

  return (
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
      <Reveal>
        <Link
          href="/agenda"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-forest-deep"
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Kembali ke agenda
        </Link>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-10 flex items-start gap-6">
          <div className="flex w-20 shrink-0 flex-col items-center rounded-2xl bg-forest-deep py-4 text-cream shadow-md md:w-24">
            <span className="font-display text-3xl font-bold leading-none md:text-4xl">
              {day}
            </span>
            <span className="mt-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold">
              {month}
            </span>
          </div>
          <div>
            {isPast && (
              <span className="mb-2 inline-block rounded-full bg-secondary px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Sudah berlalu
              </span>
            )}
            <h1 className="font-display text-3xl font-semibold leading-[1.12] tracking-tight text-forest-deep md:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-border/80 bg-paper p-6 text-sm md:flex-row md:items-center md:gap-8">
          <p className="flex items-center gap-2.5 font-medium text-forest-deep">
            <CalendarDays className="size-4.5 text-terracotta" />
            {formatEventRange(event.starts_at, event.ends_at)}
          </p>
          {event.location && (
            <p className="flex items-center gap-2.5 font-medium text-forest-deep">
              <MapPin className="size-4.5 text-terracotta" />
              {event.location}
            </p>
          )}
        </div>
      </Reveal>

      {event.cover_image && (
        <Reveal delay={280}>
          <div className="relative mt-10 aspect-[21/10] overflow-hidden rounded-[2rem] border border-border">
            <ContentImage
              src={event.cover_image}
              alt={event.title}
              fill
              priority
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      )}

      <Reveal delay={340}>
        <div className="mt-12">
          <Markdown content={event.description} />
        </div>
      </Reveal>
    </article>
  );
}
