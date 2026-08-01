import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageTitle } from "@/components/admin/page-title";
import { AdminPagination } from "@/components/admin/pagination";
import { DeleteEventButton } from "./delete-event-button";
import { adminGetEventsPage } from "@/lib/admin-data";
import { formatEventRange } from "@/lib/format";

export default async function AdminAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ halaman?: string }>;
}) {
  const { halaman } = await searchParams;
  const requestedPage = Math.max(1, parseInt(halaman ?? "1", 10) || 1);
  const { items: events, total, page, pageCount } =
    await adminGetEventsPage(requestedPage);
  const now = new Date().toISOString();

  return (
    <>
      <PageTitle
        title="Agenda"
        description={`${total} acara — yang akan datang maupun arsip.`}
      >
        <Button asChild className="rounded-full bg-forest-deep hover:bg-forest">
          <Link href="/admin/agenda/baru">
            <Plus className="mr-1 size-4" />
            Agenda Baru
          </Link>
        </Button>
      </PageTitle>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-paper hover:bg-paper">
              <TableHead className="pl-6">Acara</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => {
                const upcoming = event.starts_at >= now;
                return (
                  <TableRow key={event.id}>
                    <TableCell className="max-w-[20rem] pl-6">
                      <p className="truncate font-medium text-forest-deep">
                        {event.title}
                      </p>
                      {event.location && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {event.location}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatEventRange(event.starts_at, event.ends_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge
                          variant={
                            event.status === "published" ? "default" : "secondary"
                          }
                          className={
                            event.status === "published"
                              ? "bg-forest text-cream"
                              : ""
                          }
                        >
                          {event.status === "published" ? "Terbit" : "Draft"}
                        </Badge>
                        {upcoming && event.status === "published" && (
                          <Badge className="bg-gold text-ink">Mendatang</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-1">
                        {event.status === "published" && (
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground"
                            aria-label="Lihat di situs"
                          >
                            <Link href={`/agenda/${event.slug}`} target="_blank">
                              <ExternalLink className="size-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground"
                          aria-label="Edit"
                        >
                          <Link href={`/admin/agenda/${event.id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <DeleteEventButton id={event.id} title={event.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-14 text-center text-muted-foreground"
                >
                  Belum ada agenda. Klik “Agenda Baru” untuk menjadwalkan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AdminPagination
        page={page}
        pageCount={pageCount}
        total={total}
        buildHref={(p) =>
          p > 1 ? `/admin/agenda?halaman=${p}` : "/admin/agenda"
        }
      />
    </>
  );
}
