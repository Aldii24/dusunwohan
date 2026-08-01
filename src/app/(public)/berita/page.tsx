import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { PostCard } from "@/components/site/post-card";
import { Reveal } from "@/components/site/reveal";
import { SitePagination } from "@/components/site/pagination";
import { getPublishedPostsPage } from "@/lib/data";
import { CATEGORIES, CATEGORY_LABELS, type PostCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kabar Dusun",
  description:
    "Berita, kegiatan, pengumuman, dan cerita potensi dari Dusun Wohan, Desa Tampingan, Tegalrejo, Magelang.",
};

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; halaman?: string }>;
}) {
  const { kategori, halaman } = await searchParams;
  const activeCategory = CATEGORIES.includes(kategori as PostCategory)
    ? (kategori as PostCategory)
    : undefined;

  const requestedPage = Math.max(1, parseInt(halaman ?? "1", 10) || 1);
  const { items: posts, page, pageCount } = await getPublishedPostsPage({
    category: activeCategory,
    page: requestedPage,
    pageSize: PAGE_SIZE,
  });

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("kategori", activeCategory);
    if (p > 1) params.set("halaman", String(p));
    const qs = params.toString();
    return qs ? `/berita?${qs}` : "/berita";
  };

  return (
    <>
      <PageHeader
        eyebrow="Kabar Dusun"
        title={
          <>
            Kabar & cerita dari{" "}
            <em className="italic text-terracotta">Wohan</em>
          </>
        }
        description="Berita warga, laporan kegiatan, pengumuman resmi, sampai cerita UMKM — semua diarsipkan di sini."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        {/* Filter kategori */}
        <Reveal>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/berita"
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-semibold transition-all",
                !activeCategory
                  ? "border-forest-deep bg-forest-deep text-cream"
                  : "border-border bg-card text-muted-foreground hover:border-forest/40 hover:text-forest-deep"
              )}
            >
              Semua
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/berita?kategori=${cat}`}
                className={cn(
                  "rounded-full border px-5 py-2 text-sm font-semibold transition-all",
                  activeCategory === cat
                    ? "border-forest-deep bg-forest-deep text-cream"
                    : "border-border bg-card text-muted-foreground hover:border-forest/40 hover:text-forest-deep"
                )}
              >
                {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>
        </Reveal>

        {posts.length > 0 ? (
          <>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 100}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
            <SitePagination
              page={page}
              pageCount={pageCount}
              buildHref={buildHref}
            />
          </>
        ) : (
          <div className="mt-16 rounded-3xl border border-dashed border-border bg-paper p-16 text-center">
            <p className="font-display text-2xl text-forest-deep">
              Belum ada tulisan di kategori ini
            </p>
            <p className="mt-2 text-muted-foreground">
              Kabar baru akan muncul di sini begitu diterbitkan pengurus.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
