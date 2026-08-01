"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo, LogoMark } from "./logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Kabar" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/70 bg-cream/85 shadow-[0_2px_24px_-12px_rgb(28_43_34_/_0.25)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-forest-deep"
                  : "text-muted-foreground hover:text-forest-deep"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-terracotta transition-transform duration-300",
                  isActive(link.href) ? "scale-x-100" : "scale-x-0"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden rounded-full bg-forest-deep px-5 hover:bg-forest lg:inline-flex"
          >
            <Link href="/kontak">Hubungi Kami</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Buka menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-cream p-0">
              <SheetTitle className="sr-only">Menu navigasi</SheetTitle>
              <div className="flex items-center gap-3 border-b border-border/70 p-5">
                <LogoMark className="size-9" />
                <span className="font-display text-lg font-semibold text-forest-deep">
                  Dusun Wohan
                </span>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 font-display text-xl transition-colors",
                      isActive(link.href)
                        ? "bg-forest-deep text-cream"
                        : "text-forest-deep hover:bg-secondary"
                    )}
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <p className="px-8 pt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Tampingan · Tegalrejo · Magelang
              </p>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
