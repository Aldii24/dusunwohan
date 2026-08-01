import { Badge } from "@/components/ui/badge";
import { PageTitle } from "@/components/admin/page-title";
import { AdminPagination } from "@/components/admin/pagination";
import { MessageActions } from "./message-actions";
import { adminGetCounts, adminGetMessagesPage } from "@/lib/admin-data";
import { formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export default async function AdminPesanPage({
  searchParams,
}: {
  searchParams: Promise<{ halaman?: string }>;
}) {
  const { halaman } = await searchParams;
  const requestedPage = Math.max(1, parseInt(halaman ?? "1", 10) || 1);
  const [{ items: messages, total, page, pageCount }, counts] =
    await Promise.all([adminGetMessagesPage(requestedPage), adminGetCounts()]);
  const unreadCount = counts.unreadMessages;

  return (
    <>
      <PageTitle
        title="Pesan Masuk"
        description={
          unreadCount > 0
            ? `${unreadCount} pesan belum dibaca dari total ${total}.`
            : `Semua ${total} pesan sudah dibaca.`
        }
      />

      {messages.length > 0 ? (
        <>
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className={cn(
                "rounded-2xl border bg-card p-6 transition-colors",
                msg.is_read
                  ? "border-border"
                  : "border-terracotta/40 bg-terracotta-soft/40"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <p className="font-display text-lg font-semibold text-forest-deep">
                      {msg.name}
                    </p>
                    {!msg.is_read && (
                      <Badge className="bg-terracotta text-cream">Baru</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {msg.contact} · {formatDate(msg.created_at)}{" "}
                    {formatTime(msg.created_at)}
                  </p>
                </div>
                <MessageActions id={msg.id} isRead={msg.is_read} />
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                {msg.content}
              </p>
            </li>
          ))}
        </ul>
        <AdminPagination
          page={page}
          pageCount={pageCount}
          total={total}
          buildHref={(p) =>
            p > 1 ? `/admin/pesan?halaman=${p}` : "/admin/pesan"
          }
        />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-paper py-16 text-center text-muted-foreground">
          Belum ada pesan masuk dari form kontak.
        </div>
      )}
    </>
  );
}
