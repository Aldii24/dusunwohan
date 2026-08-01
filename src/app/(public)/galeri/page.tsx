import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { GalleryLightbox } from "@/components/site/gallery-lightbox";
import { SitePagination } from "@/components/site/pagination";
import { getGalleryItemsPage } from "@/lib/data";

export const revalidate = 60;

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Potret keseharian, kegiatan, dan pemandangan Dusun Wohan dalam bingkai foto.",
};

export default async function GaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ halaman?: string }>;
}) {
  const { halaman } = await searchParams;
  const requestedPage = Math.max(1, parseInt(halaman ?? "1", 10) || 1);
  const { items, page, pageCount } = await getGalleryItemsPage(
    requestedPage,
    PAGE_SIZE
  );

  const buildHref = (p: number) =>
    p > 1 ? `/galeri?halaman=${p}` : "/galeri";

  return (
    <>
      <PageHeader
        eyebrow="Galeri"
        title={
          <>
            Wohan dalam <em className="italic text-terracotta">bingkai</em>
          </>
        }
        description="Sawah yang menguning, warga yang bergotong royong, dan momen-momen yang layak dikenang."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        {items.length > 0 ? (
          <>
            <GalleryLightbox items={items} />
            <SitePagination
              page={page}
              pageCount={pageCount}
              buildHref={buildHref}
            />
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-paper p-16 text-center">
            <p className="font-display text-2xl text-forest-deep">
              Galeri masih kosong
            </p>
            <p className="mt-2 text-muted-foreground">
              Foto-foto dusun akan muncul di sini begitu diunggah pengurus.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
