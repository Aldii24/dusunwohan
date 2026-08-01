import Link from "next/link";
import { ContentImage } from "./content-image";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const CATEGORY_STYLES: Record<Post["category"], string> = {
  berita: "bg-forest text-cream",
  kegiatan: "bg-gold text-ink",
  pengumuman: "bg-terracotta text-cream",
  potensi: "bg-forest-deep text-cream",
};

export function CategoryChip({
  category,
  className,
}: {
  category: Post["category"];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]",
        CATEGORY_STYLES[category],
        className
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}

export function PostCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/berita/${post.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card transition-all duration-500",
        "hover:-translate-y-1.5 hover:border-forest/30 hover:shadow-[0_24px_48px_-24px_rgb(28_43_34_/_0.35)]"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-secondary",
          featured ? "aspect-[16/9]" : "aspect-[3/2]"
        )}
      >
        {post.cover_image ? (
          <ContentImage
            src={post.cover_image}
            alt={post.title}
            fill
            sizes={featured ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="kawung absolute inset-0 opacity-20" />
        )}
        <CategoryChip
          category={post.category}
          className="absolute left-4 top-4 shadow-sm"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {formatDate(post.published_at)} · {readingTime(post.content)}
        </p>
        <h3
          className={cn(
            "mt-3 font-display font-semibold leading-snug text-forest-deep transition-colors group-hover:text-terracotta",
            featured ? "text-2xl md:text-[1.7rem]" : "text-xl"
          )}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed text-muted-foreground",
              featured ? "line-clamp-3" : "line-clamp-2"
            )}
          >
            {post.excerpt}
          </p>
        )}
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-terracotta">
          Baca selengkapnya
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
