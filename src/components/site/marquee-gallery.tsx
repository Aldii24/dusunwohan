import { ContentImage } from "./content-image";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

function GalleryCard({
  item,
  index,
}: {
  item: GalleryItem;
  index: number;
}) {
  return (
    <div
      className={cn(
        "relative h-56 shrink-0 overflow-hidden rounded-2xl border border-border/70 md:h-64",
        index % 3 === 0 ? "w-80 md:w-96" : "w-56 md:w-64",
        index % 2 === 0 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]"
      )}
    >
      <ContentImage
        src={item.image_url}
        alt={item.title ?? "Foto dusun"}
        fill
        sizes="400px"
        className="object-cover"
      />
    </div>
  );
}

/** Strip foto berjalan untuk beranda. */
export function MarqueeGallery({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;
  const row = items.slice(0, 8);

  // Marquee butuh isi diduplikasi (2 baris) biar animasi translateX(-50%)
  // seamless. Kalau fotonya cuma sedikit, duplikasi itu justru terlihat
  // seperti foto dobel â€” tampilkan statis tanpa animasi.
  if (row.length < 4) {
    return (
      <div className="flex flex-wrap justify-start gap-5 px-5 md:px-8">
        {row.map((item, i) => (
          <GalleryCard key={item.id} item={item} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="animate-marquee flex w-max gap-5 pr-5">
        {[0, 1].map((half) => (
          <div key={half} className="flex gap-5" aria-hidden={half === 1}>
            {row.map((item, i) => (
              <GalleryCard
                key={`${half}-${item.id}`}
                item={item}
                index={i}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}