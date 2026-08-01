import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/site/icons";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/site/reveal";
import { getSiteContact } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi pengurus Dusun Wohan — kirim pesan, sampaikan kabar, atau sekadar menyapa.",
};

export default async function KontakPage() {
  const contact = await getSiteContact();

  const channels = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat pengurus dusun",
      href: `https://wa.me/${contact.whatsapp}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: `@${contact.instagram}`,
      href: `https://instagram.com/${contact.instagram}`,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title={
          <>
            Mari <em className="italic text-terracotta">srawung</em>
          </>
        }
        description="Ada kabar untuk dusun? Pertanyaan? Atau sekadar kangen suasana Wohan? Sampaikan lewat sini."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Reveal>
              <div className="rounded-3xl border border-border/80 bg-paper p-7">
                <MapPin className="size-6 text-terracotta" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Alamat
                </p>
                <p className="mt-2 font-medium leading-relaxed text-forest-deep">
                  {contact.alamat}
                </p>
              </div>
            </Reveal>

            <div className="mt-5 space-y-4">
              {channels.map((ch, i) => (
                <Reveal key={ch.label} delay={(i + 1) * 100}>
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 rounded-2xl border border-border/80 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-[0_16px_32px_-20px_rgb(28_43_34_/_0.35)]"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-forest-deep text-gold transition-transform duration-300 group-hover:-rotate-6">
                      <ch.icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {ch.label}
                      </span>
                      <span className="mt-0.5 block font-medium text-forest-deep">
                        {ch.value}
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={150}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
