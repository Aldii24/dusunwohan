import type { Metadata } from "next";
import Image from "next/image";
import {
  Building2,
  Compass,
  Eye,
  HandHeart,
  Landmark,
  Mountain,
  School,
  Target,
  TreePine,
  Waves,
} from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { getSiteOfficials, getSiteStats } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Profil Dusun",
  description:
    "Sejarah, visi misi, wilayah, dan struktur Dusun Wohan, Desa Tampingan, Kecamatan Tegalrejo, Kabupaten Magelang.",
};

const MISI = [
  "Merawat kerukunan dan tradisi gotong royong antarwarga.",
  "Mendukung pertanian dan UMKM warga agar semakin berdaya.",
  "Membina generasi muda melalui kegiatan karang taruna dan keagamaan.",
  "Menjaga lingkungan dusun tetap bersih, hijau, dan nyaman dihuni.",
  "Membuka informasi kegiatan dusun secara terbuka bagi seluruh warga.",
];

const FASILITAS = [
  { icon: Landmark, label: "Balai Dusun", desc: "Pusat kegiatan dan musyawarah warga" },
  { icon: Building2, label: "Mushola & Masjid", desc: "Kegiatan ibadah dan pengajian rutin" },
  { icon: School, label: "TPQ", desc: "Pendidikan Al-Qur'an untuk anak-anak" },
  { icon: HandHeart, label: "Posyandu", desc: "Layanan kesehatan balita dan lansia" },
  { icon: Waves, label: "Saluran Irigasi", desc: "Pengairan sawah yang dirawat swadaya" },
  { icon: TreePine, label: "Lapangan", desc: "Olahraga dan acara besar dusun" },
];

export default async function ProfilPage() {
  const [stats, officials] = await Promise.all([
    getSiteStats(),
    getSiteOfficials(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Profil Dusun"
        title={
          <>
            Mengenal <em className="italic text-terracotta">Wohan</em> lebih
            dekat
          </>
        }
        description="Sejarah, wilayah, dan orang-orang yang menjaga dusun ini tetap guyub dari generasi ke generasi."
      />

      {/* Sejarah */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow="Sejarah" title="Cerita yang diwariskan" />
            <Reveal delay={150}>
              <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[2rem] border border-border">
                <Image
                  src="/images/ph-senja.svg"
                  alt="Ilustrasi senja di Dusun Wohan"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground lg:pt-4">
              <p className="font-display text-xl italic leading-relaxed text-forest-deep md:text-2xl">
                &ldquo;Nama sebuah dusun selalu menyimpan doa dari para
                pendirinya.&rdquo;
              </p>
              <p>
                Seperti banyak dusun tua di lereng pegunungan Magelang, Wohan
                tumbuh dari sekumpulan keluarga petani yang membuka lahan,
                menanam padi, dan membangun kampung secara bersama-sama. Cerita
                tentang asal-usul nama dan para sesepuh pendiri dusun
                diwariskan secara lisan dari simbah ke anak-cucu — sebagian
                masih terjaga, sebagian menunggu untuk dituliskan kembali.
              </p>
              <p>
                Yang tidak pernah putus adalah caranya hidup: sambatan saat ada
                warga membangun rumah, kenduri saat panen tiba, dan lampu balai
                dusun yang menyala saat ada kabar — baik maupun duka — yang
                perlu dibagikan.
              </p>
              <p>
                Halaman ini akan terus dilengkapi oleh warga. Jika simbah atau
                orang tua Anda menyimpan cerita tentang Wohan zaman dulu,
                sampaikan kepada pengurus — biar arsip dusun ini semakin kaya.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="relative overflow-hidden bg-forest-deep py-24 text-cream md:py-32">
        <div className="kawung pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Arah Bersama"
            title="Visi & misi dusun"
            inverted
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <Reveal>
              <div className="flex h-full flex-col rounded-3xl bg-cream/[0.07] p-8 backdrop-blur-sm md:p-10">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gold text-ink">
                  <Eye className="size-6" />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-gold">
                  Visi
                </p>
                <p className="mt-4 font-display text-2xl font-medium leading-snug md:text-3xl">
                  Dusun yang guyub, mandiri, dan lestari — nyaman dihuni,
                  membanggakan untuk dipulangi.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="h-full rounded-3xl bg-cream/[0.07] p-8 backdrop-blur-sm md:p-10">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-terracotta text-cream">
                  <Target className="size-6" />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-gold">
                  Misi
                </p>
                <ul className="mt-4 space-y-3.5">
                  {MISI.map((misi, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold font-display text-xs font-bold text-ink">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-cream/85 md:text-base">
                        {misi}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Wilayah */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading
          eyebrow="Wilayah"
          title="Sepetak Magelang di kaki gunung"
          description="Dusun Wohan berada di Desa Tampingan, Kecamatan Tegalrejo — dataran subur Kabupaten Magelang yang dikelilingi panorama pegunungan."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Mountain, label: "Topografi", value: "Dataran & sawah irigasi" },
            { icon: Compass, label: "Kecamatan", value: "Tegalrejo, Kab. Magelang" },
            { icon: TreePine, label: "Luas Wilayah", value: stats.luas },
            { icon: Landmark, label: "Lingkungan", value: `${stats.rt} RT dalam ${stats.rw} RW` },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 100}>
              <div className="h-full rounded-3xl border border-border/80 bg-card p-7">
                <item.icon className="size-6 text-terracotta" />
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-forest-deep">
                  {item.value}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Struktur */}
      <section className="border-y border-border/70 bg-paper py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Struktur Dusun"
            title="Yang dipercaya mengurus"
            description="Susunan pengurus Dusun Wohan. Pengurus dapat memperbarui daftar ini melalui menu Pengaturan di panel admin."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {officials.map((p, i) => (
              <Reveal key={p.jabatan} delay={(i % 3) * 100}>
                <div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-forest-deep font-display text-lg font-semibold text-gold">
                    {p.jabatan
                      .split(" ")
                      .slice(-2)
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">
                      {p.jabatan}
                    </p>
                    <p className="mt-1 truncate font-medium text-forest-deep">
                      {p.nama}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading
          eyebrow="Fasilitas"
          title="Yang kami rawat bersama"
          align="center"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FASILITAS.map((f, i) => (
            <Reveal key={f.label} delay={(i % 3) * 100}>
              <div className="group h-full rounded-3xl border border-border/80 bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-forest/30 hover:shadow-[0_20px_40px_-24px_rgb(28_43_34_/_0.3)]">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-terracotta-soft text-terracotta transition-transform duration-500 group-hover:-rotate-6">
                  <f.icon className="size-6" />
                </div>
                <p className="mt-5 font-display text-lg font-semibold text-forest-deep">
                  {f.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
