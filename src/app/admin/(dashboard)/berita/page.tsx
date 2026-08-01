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
import { DeleteRowButton } from "./delete-row-button";
import { adminGetPostsPage } from "@/lib/admin-data";
import { CATEGORY_LABELS } from "@/lib/types";
import { formatDateShort } from "@/lib/format";

export default async function AdminBeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ halaman?: string }>;
}) {
  const { halaman } = await searchParams;
  const requestedPage = Math.max(1, parseInt(halaman ?? "1", 10) || 1);
  const { items: posts, total, page, pageCount } =
    await adminGetPostsPage(requestedPage);

  return (
    <>
      <PageTitle
        title="Kabar & Berita"
        description={`${total} tulisan — berita, kegiatan, pengumuman, dan potensi.`}
      >
        <Button asChild className="rounded-full bg-forest-deep hover:bg-forest">
          <Link href="/admin/berita/baru">
            <Plus className="mr-1 size-4" />
            Tulisan Baru
          </Link>
        </Button>
      </PageTitle>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-paper hover:bg-paper">
              <TableHead className="pl-6">Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="pr-6 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-[22rem] pl-6">
                    <p className="truncate font-medium text-forest-deep">
                      {post.title}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                      /{post.slug}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[post.category]}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        post.status === "published" ? "default" : "secondary"
                      }
                      className={
                        post.status === "published" ? "bg-forest text-cream" : ""
                      }
                    >
                      {post.status === "published" ? "Terbit" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateShort(post.published_at ?? post.created_at)}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex items-center justify-end gap-1">
                      {post.status === "published" && (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground"
                          aria-label="Lihat di situs"
                        >
                          <Link href={`/berita/${post.slug}`} target="_blank">
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
                        <Link href={`/admin/berita/${post.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteRowButton id={post.id} title={post.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-14 text-center text-muted-foreground"
                >
                  Belum ada tulisan. Klik “Tulisan Baru” untuk memulai.
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
          p > 1 ? `/admin/berita?halaman=${p}` : "/admin/berita"
        }
      />
    </>
  );
}
