"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ContentImage } from "./content-image";
import type { GalleryItem } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Reveal } from "./reveal";

/**
 * Grid masonry yang mengikuti rasio asli tiap foto (landscape tampil
 * landscape, portrait tampil portrait — tanpa crop), plus lightbox.
 */
export function GalleryLightbox({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const active = index !== null ? items[index] : null;

  const step = (dir: 1 | -1) => {
    if (index === null) return;
    setIndex((index + dir + items.length) % items.length);
  };

  return (
    <>
      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={(i % 3) * 80} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-border/70 bg-secondary"
              aria-label={item.title ?? "Perbesar foto"}
            >
              <ContentImage
                src={item.image_url}
                alt={item.title ?? "Foto dusun"}
                width={1200}
                height={900}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {item.title && (
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-sm font-medium text-cream opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.title}
                </span>
              )}
            </button>
          </Reveal>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl border-none bg-transparent p-0 shadow-none"
        >
          {active && (
            <div className="overflow-hidden rounded-3xl bg-forest-deep">
              <DialogTitle className="sr-only">
                {active.title ?? "Foto dusun"}
              </DialogTitle>
              <div className="relative flex items-center justify-center bg-ink/40">
                <ContentImage
                  src={active.image_url}
                  alt={active.title ?? "Foto dusun"}
                  width={1600}
                  height={1200}
                  sizes="90vw"
                  className="h-auto max-h-[72vh] w-auto max-w-full"
                />
                <button
                  type="button"
                  onClick={() => setIndex(null)}
                  className="absolute right-4 top-4 rounded-full bg-ink/50 p-2 text-cream backdrop-blur transition hover:bg-ink/80"
                  aria-label="Tutup"
                >
                  <X className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-ink/50 p-2 text-cream backdrop-blur transition hover:bg-ink/80"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-ink/50 p-2 text-cream backdrop-blur transition hover:bg-ink/80"
                  aria-label="Berikutnya"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
              <div className="flex items-end justify-between gap-4 p-5 text-cream">
                <div>
                  {active.title && (
                    <p className="font-display text-lg font-semibold">
                      {active.title}
                    </p>
                  )}
                  {active.caption && (
                    <p className="mt-1 text-sm text-cream/70">{active.caption}</p>
                  )}
                </div>
                <p className="shrink-0 text-xs text-cream/50">
                  {formatDate(active.created_at)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
