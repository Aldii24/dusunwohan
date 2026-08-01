import type { Metadata } from "next";
import { CalendarClock, History } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { EventCard } from "@/components/site/event-card";
import { Reveal } from "@/components/site/reveal";
import { getPastEvents, getUpcomingEvents } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Agenda Dusun",
  description:
    "Agenda dan acara mendatang di Dusun Wohan — dari kerja bakti, pengajian, sampai perayaan besar dusun.",
};

export default async function AgendaPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(6),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title={
          <>
            Yang akan datang di{" "}
            <em className="italic text-terracotta">Wohan</em>
          </>
        }
        description="Catat tanggalnya, ajak keluarga dan tetangga. Semua acara dusun tercatat di halaman ini."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-forest-deep text-gold">
              <CalendarClock className="size-5" />
            </span>
            <h2 className="font-display text-2xl font-semibold text-forest-deep md:text-3xl">
              Agenda mendatang
            </h2>
          </div>
        </Reveal>

        {upcoming.length > 0 ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {upcoming.map((event, i) => (
              <Reveal key={event.id} delay={(i % 2) * 100}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-paper p-14 text-center">
            <p className="font-display text-xl text-forest-deep">
              Belum ada agenda mendatang
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Agenda baru akan muncul di sini begitu dijadwalkan pengurus.
            </p>
          </div>
        )}

        {past.length > 0 && (
          <>
            <Reveal className="mt-20">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-forest-deep">
                  <History className="size-5" />
                </span>
                <h2 className="font-display text-2xl font-semibold text-forest-deep md:text-3xl">
                  Sudah berlalu
                </h2>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {past.map((event, i) => (
                <Reveal key={event.id} delay={(i % 2) * 100}>
                  <EventCard event={event} past />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
