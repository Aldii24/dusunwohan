import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "./icons";
import { getSiteContact } from "@/lib/data";
import { LogoMark } from "./logo";

const NAV = [
  { href: "/profil", label: "Profil Dusun" },
  { href: "/berita", label: "Kabar & Berita" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
];

export async function Footer() {
  const contact = await getSiteContact();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-forest-deep text-cream">
      {/* punggung bukit sebagai transisi dari halaman */}
      <svg
        viewBox="0 0 1440 90"
        className="block w-full text-cream"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0 L1440 0 L1440 22 Q1180 88 900 46 T420 60 Q200 76 0 30 Z"
          fill="currentColor"
        />
      </svg>

      <div className="kawung pointer-events-none absolute inset-0 opacity-[0.05]" />

      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="size-11" />
              <div className="leading-none">
                <p className="font-display text-2xl font-semibold">Dusun Wohan</p>
                <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-cream/60">
                  Desa Tampingan · Kec. Tegalrejo · Kab. Magelang
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/75">
              Situs warga Dusun Wohan — tempat berbagi kabar, mengarsipkan
              kegiatan, dan merawat cerita dusun di kaki pegunungan Magelang.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Jelajahi
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-grow text-sm text-cream/80 hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Kontak
            </p>
            <ul className="mt-4 space-y-3 text-sm text-cream/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>{contact.alamat}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-grow hover:text-cream"
                >
                  WhatsApp Pengurus
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
                <a
                  href={`mailto:${contact.email}`}
                  className="link-grow hover:text-cream"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <InstagramIcon className="mt-0.5 size-4 shrink-0 text-gold" />
                <a
                  href={`https://instagram.com/${contact.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-grow hover:text-cream"
                >
                  @{contact.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Dusun Wohan. Dikelola dengan gotong royong oleh warga.
          </p>
          <Link href="/admin" className="link-grow hover:text-cream/80">
            Masuk Admin
          </Link>
        </div>
      </div>

      {/* watermark nama dusun */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none px-5 pb-2 text-center font-display text-[clamp(4rem,16vw,13rem)] font-bold leading-[0.8] tracking-tight text-cream/[0.06]"
      >
        WOHAN
      </p>
    </footer>
  );
}
