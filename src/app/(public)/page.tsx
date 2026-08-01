import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Store,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentImage } from "@/components/site/content-image";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { PostCard } from "@/components/site/post-card";
import { EventCard } from "@/components/site/event-card";
import { Ticker } from "@/components/site/ticker";
import { MarqueeGallery } from "@/components/site/marquee-gallery";
import {
  getGalleryItems,
  getPublishedPosts,
  getSiteContact,
  getSiteStats,
  getUpcomingEvents,
} from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, events, gallery, stats, contact] = await Promise.all([
    getPublishedPosts({ limit: 4 }),
    getUpcomingEvents(3),
    getGalleryItems(8),
    getSiteStats(),
    getSiteContact(),
  ]);

  const [featured, ...rest] = posts;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <div className="kawung pointer-events-none absolute inset-0 opacity-[0.05]" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-[38vh] pt-32 text-center md:px-8 md:pb-[34vh]">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-forest/25 bg-paper/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-forest backdrop-blur">
              <span className="size-1.5 rounded-full bg-terracotta" />
              Situs Warga · Desa Tampingan
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-[clamp(3.2rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-tight text-forest-deep">
              Dusun{" "}
              <em className="font-medium italic text-terracotta">Wohan</em>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
              Sepetak tanah yang guyub di Desa Tampingan, Kecamatan Tegalrejo,
              Kabupaten Magelang — tempat sawah, cerita, dan gotong royong
              tumbuh bersama.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-forest-deep px-7 text-base hover:bg-forest"
              >
                <Link href="/berita">
                  Baca Kabar Dusun
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-forest/30 bg-paper/60 px-7 text-base text-forest-deep backdrop-blur hover:bg-paper"
              >
                <Link href="/profil">Kenali Dusun Kami</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* panorama sawah — foto asli, dilebur ke warna krem di tepi atasnya */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] md:h-[46vh]">
          <Image
            src="/photos/hero-sawah.jpg"
            alt="Hamparan sawah dan pepohonan kelapa di pedesaan"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-cream via-cream/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/40 to-transparent" />
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
          <ArrowDown className="size-5 animate-bounce text-cream drop-shadow" />
        </div>
      </section>

      {/* ============ STATISTIK ============ */}
      <section className="relative bg-forest-deep text-cream">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 md:grid-cols-4 md:px-8">
          {[
            { value: stats.penduduk, label: "Jiwa Penduduk", suffix: "" },
            { value: stats.kk, label: "Kepala Keluarga", suffix: "" },
            { value: `${stats.rt} RT · ${stats.rw} RW`, label: "Lingkungan", suffix: "" },
            { value: stats.luas, label: "Luas Wilayah", suffix: "" },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 90}>
              <div className="relative pl-5 text-left">
                <span className="absolute left-0 top-1 h-[calc(100%-0.25rem)] w-1 rounded-full bg-gold" />
                <p className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  {item.value}
                </p>
                <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.18em] text-cream/60">
                  {item.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Ticker />

      {/* ============ TENTANG ============ */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border">
                <Image
                  src="/photos/kampung-aerial.jpg"
                  alt="Atap-atap rumah kampung di tengah hamparan sawah"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-4 w-44 rotate-3 overflow-hidden rounded-2xl border-4 border-paper shadow-xl md:-right-8 md:w-56">
                <div className="relative aspect-[3/2]">
                  <Image
                    src="/photos/sepeda-sawah.jpg"
                    alt="Warga bersepeda menyusuri pematang sawah saat matahari terbit"
                    fill
                    sizes="250px"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="absolute -left-3 top-6 -rotate-3 rounded-full bg-gold px-4 py-2 font-display text-sm font-semibold italic text-ink shadow-md md:-left-6">
                Sejak dulu, guyub.
              </p>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Tentang Wohan"
              title="Dusun kecil, hidup yang tidak kecil"
            />
            <Reveal delay={150}>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Wohan adalah salah satu dusun di Desa Tampingan, Kecamatan
                  Tegalrejo, Kabupaten Magelang. Dikelilingi sawah dan udara
                  pegunungan, hari-hari di sini berjalan dengan irama yang khas:
                  berangkat ke ladang pagi-pagi, ronda bergilir, pengajian
                  malam Jumat, dan kerja bakti di akhir pekan.
                </p>
                <p>
                  Situs ini dikelola warga untuk mengarsipkan kabar, kegiatan,
                  dan potensi dusun — supaya yang jauh tetap dekat, dan yang
                  akan datang tahu dusunnya punya cerita.
                </p>
              </div>
            </Reveal>
            <Reveal delay={250}>
              <Button
                asChild
                variant="link"
                className="mt-6 h-auto p-0 text-base font-semibold text-terracotta"
              >
                <Link href="/profil" className="group">
                  Selengkapnya tentang profil dusun
                  <ArrowUpRight className="ml-1 size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ KABAR TERBARU ============ */}
      <section className="border-y border-border/70 bg-paper py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Kabar Dusun"
            title="Cerita terbaru dari Wohan"
            href="/berita"
            linkLabel="Semua kabar"
          />

          {featured ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Reveal>
                <PostCard post={featured} featured />
              </Reveal>
              <div className="flex flex-col gap-6">
                {rest.slice(0, 2).map((post, i) => (
                  <Reveal key={post.id} delay={(i + 1) * 120}>
                    <Link
                      href={`/berita/${post.slug}`}
                      className="group flex gap-5 rounded-3xl border border-border/80 bg-card p-5 transition-all duration-500 hover:-translate-y-1 hover:border-forest/30 hover:shadow-[0_20px_40px_-24px_rgb(28_43_34_/_0.35)]"
                    >
                      {post.cover_image && (
                        <div className="relative hidden w-28 shrink-0 overflow-hidden rounded-2xl sm:block">
                          <ContentImage
                            src={post.cover_image}
                            alt=""
                            fill
                            sizes="150px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-terracotta">
                          {post.category === "pengumuman"
                            ? "Pengumuman"
                            : post.category === "kegiatan"
                              ? "Kegiatan"
                              : post.category === "potensi"
                                ? "Potensi & UMKM"
                                : "Berita"}
                        </p>
                        <h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold leading-snug text-forest-deep transition-colors group-hover:text-terracotta">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-12 text-muted-foreground">
              Belum ada kabar yang diterbitkan.
            </p>
          )}
        </div>
      </section>

      {/* ============ AGENDA ============ */}
      <section className="relative overflow-hidden bg-forest-deep py-24 text-cream md:py-32">
        <div className="kawung pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Agenda Mendatang"
            title="Jangan sampai terlewat"
            description="Acara dan kegiatan yang akan datang di Dusun Wohan. Catat tanggalnya, ajak tetangga."
            href="/agenda"
            linkLabel="Semua agenda"
            inverted
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event, i) => (
                <Reveal key={event.id} delay={i * 120}>
                  <EventCard event={event} />
                </Reveal>
              ))
            ) : (
              <p className="text-cream/70">
                Belum ada agenda mendatang. Pantau terus halaman ini.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ============ GALERI ============ */}
      <section className="overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Galeri"
            title="Potret keseharian dusun"
            href="/galeri"
            linkLabel="Buka galeri"
          />
        </div>
        <Reveal className="mt-12">
          {gallery.length > 0 ? (
            <MarqueeGallery items={gallery} />
          ) : (
            <p className="mx-auto max-w-6xl px-5 text-muted-foreground md:px-8">
              Foto-foto dusun akan tampil di sini begitu diunggah pengurus.
            </p>
          )}
        </Reveal>
      </section>

      {/* ============ POTENSI ============ */}
      <section className="border-t border-border/70 bg-paper py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Potensi Dusun"
            title="Yang tumbuh dari Wohan"
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Leaf,
                title: "Pertanian",
                desc: "Sawah dan ladang adalah napas utama dusun — padi, sayuran, dan hasil bumi musiman yang menghidupi banyak keluarga.",
              },
              {
                icon: Store,
                title: "UMKM Rumahan",
                desc: "Keripik, camilan, dan aneka produk rumahan buatan ibu-ibu yang mulai merambah warung dan pasar daring.",
              },
              {
                icon: Users,
                title: "Gotong Royong",
                desc: "Modal sosial paling berharga: kerja bakti, sambatan, ronda, dan tradisi guyub yang dijaga turun-temurun.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="group h-full rounded-3xl border border-border/80 bg-card p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-forest/30 hover:shadow-[0_24px_48px_-24px_rgb(28_43_34_/_0.3)]">
                  <div className="flex size-13 items-center justify-center rounded-2xl bg-forest-deep text-gold transition-transform duration-500 group-hover:-rotate-6">
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-forest-deep">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-terracotta px-6 py-16 text-center text-cream md:px-16 md:py-20">
            <div className="kawung pointer-events-none absolute inset-0 opacity-[0.08]" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-soft">
                Punya kabar? Mau bertanya?
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight md:text-5xl">
                Silaturahmi tidak harus menunggu lebaran
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-cream/85">
                Kirim pesan lewat form kontak, atau langsung sapa pengurus dusun
                lewat WhatsApp. Kami senang mendengar dari Anda.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-cream px-7 text-base text-forest-deep hover:bg-paper"
                >
                  <Link href="/kontak">Tulis Pesan</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-cream/40 bg-transparent px-7 text-base text-cream hover:bg-cream/10 hover:text-cream"
                >
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
