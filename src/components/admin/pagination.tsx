import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPaginationProps {
  page: number;
  pageCount: number;
  total: number;
  buildHref: (page: number) => string;
}

export function AdminPagination({
  page,
  pageCount,
  total,
  buildHref,
}: AdminPaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <div className="mt-5 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Halaman <span className="font-semibold text-forest-deep">{page}</span>{" "}
        dari {pageCount} · {total} data
      </p>
      <div className="flex gap-2">
        <Button
          asChild={page > 1}
          variant="outline"
          size="sm"
          disabled={page <= 1}
          className="rounded-full bg-card"
        >
          {page > 1 ? (
            <Link href={buildHref(page - 1)}>
              <ChevronLeft className="mr-1 size-4" />
              Sebelumnya
            </Link>
          ) : (
            <span>
              <ChevronLeft className="mr-1 size-4" />
              Sebelumnya
            </span>
          )}
        </Button>
        <Button
          asChild={page < pageCount}
          variant="outline"
          size="sm"
          disabled={page >= pageCount}
          className="rounded-full bg-card"
        >
          {page < pageCount ? (
            <Link href={buildHref(page + 1)}>
              Berikutnya
              <ChevronRight className="ml-1 size-4" />
            </Link>
          ) : (
            <span>
              Berikutnya
              <ChevronRight className="ml-1 size-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
