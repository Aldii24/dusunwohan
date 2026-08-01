"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Images,
  LayoutDashboard,
  MessagesSquare,
  Newspaper,
  Settings,
} from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/berita", label: "Kabar & Berita", icon: Newspaper },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/pesan", label: "Pesan Masuk", icon: MessagesSquare },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export function AdminNav({
  orientation = "vertical",
  onNavigate,
}: {
  orientation?: "vertical" | "horizontal";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <nav
      className={cn(
        "gap-1",
        orientation === "vertical" ? "flex flex-col" : "flex overflow-x-auto"
      )}
    >
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
            isActive(item)
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <item.icon
            className={cn(
              "size-4.5 shrink-0",
              isActive(item) && "text-sidebar-primary"
            )}
          />
          <span className="whitespace-nowrap">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <Link href="/admin" className="flex items-center gap-3 px-6 pb-6 pt-7">
        <LogoMark className="size-10" />
        <span className="leading-none">
          <span className="block font-display text-lg font-semibold text-sidebar-foreground">
            Dusun Wohan
          </span>
          <span className="mt-1 block text-[0.62rem] font-medium uppercase tracking-[0.2em] text-sidebar-foreground/50">
            Panel Pengurus
          </span>
        </span>
      </Link>
      <div className="flex-1 px-3">
        <AdminNav />
      </div>
      <p className="px-6 pb-6 text-[0.65rem] leading-relaxed text-sidebar-foreground/40">
        Konten yang diterbitkan langsung tampil di situs publik.
      </p>
    </aside>
  );
}
