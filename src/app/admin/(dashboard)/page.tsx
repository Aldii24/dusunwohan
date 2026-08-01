import Link from "next/link";
import {
  CalendarDays,
  FileEdit,
  Images,
  MailWarning,
  Newspaper,
  PenLine,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from "@/components/admin/page-title";
import {
  adminGetCounts,
  adminGetMessages,
  adminGetPosts,
} from "@/lib/admin-data";
import { CATEGORY_LABELS } from "@/lib/types";
import { formatDateShort } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [counts, posts, messages] = await Promise.all([
    adminGetCounts(),
    adminGetPosts(),
    adminGetMessages(),
  ]);

  const recentPosts = posts.slice(0, 6);
  const unread = messages.filter((m) => !m.is_read).slice(0, 4);

  const statCards = [
    {
      icon: Newspaper,
      label: "Total Tulisan",
      value: counts.posts,
      href: "/admin/berita",
    },
    {
      icon: FileEdit,
      label: "Draft",
      value: counts.drafts,
      href: "/admin/berita",
    },
    {
      icon: CalendarDays,
      label: "Agenda Mendatang",
      value: counts.upcomingEvents,
      href: "/admin/agenda",
    },
    {
      icon: Images,
      label: "Foto Galeri",
      value: counts.gallery,
      href: "/admin/galeri",
    },
    {
      icon: MailWarning,
      label: "Pesan Belum Dibaca",
      value: counts.unreadMessages,
      href: "/admin/pesan",
      highlight: counts.unreadMessages > 0,
    },
  ];

  return (
    <>
      <PageTitle
        title="Sugeng rawuh, Pengurus 👋"
        description="Ringkasan situs Dusun Wohan hari ini."
      >
        <Button asChild className="rounded-full bg-forest-deep hover:bg-forest">
          <Link href="/admin/berita/baru">
            <Plus className="mr-1 size-4" />
            Tulis Kabar
          </Link>
        </Button>
      </PageTitle>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <card.icon
                className={
                  card.highlight
                    ? "size-5 text-terracotta"
                    : "size-5 text-forest"
                }
              />
              {card.highlight && (
                <span className="size-2 animate-pulse rounded-full bg-terracotta" />
              )}
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-forest-deep">
              {card.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Tulisan terbaru */}
        <section className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-forest-deep">
              Tulisan terbaru
            </h2>
            <Link
              href="/admin/berita"
              className="text-sm font-semibold text-terracotta hover:underline"
            >
              Kelola semua
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/admin/berita/${post.id}`}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-paper"
                  >
                    <PenLine className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-forest-deep">
                        {post.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {CATEGORY_LABELS[post.category]} ·{" "}
                        {formatDateShort(post.published_at ?? post.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={post.status === "published" ? "default" : "secondary"}
                      className={
                        post.status === "published"
                          ? "bg-forest text-cream"
                          : ""
                      }
                    >
                      {post.status === "published" ? "Terbit" : "Draft"}
                    </Badge>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-6 py-10 text-center text-sm text-muted-foreground">
                Belum ada tulisan. Mulai tulis kabar pertama dusun!
              </li>
            )}
          </ul>
        </section>

        {/* Pesan belum dibaca */}
        <section className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-forest-deep">
              Pesan belum dibaca
            </h2>
            <Link
              href="/admin/pesan"
              className="text-sm font-semibold text-terracotta hover:underline"
            >
              Semua pesan
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {unread.length > 0 ? (
              unread.map((msg) => (
                <li key={msg.id} className="px-6 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium text-forest-deep">{msg.name}</p>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {formatDateShort(msg.created_at)}
                    </p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {msg.content}
                  </p>
                </li>
              ))
            ) : (
              <li className="px-6 py-10 text-center text-sm text-muted-foreground">
                Tidak ada pesan baru. 🎉
              </li>
            )}
          </ul>
        </section>
      </div>
    </>
  );
}
