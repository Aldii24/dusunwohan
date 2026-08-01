import type { Metadata } from "next";
import Link from "next/link";
import { ContentImage } from "@/components/site/content-image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { Markdown } from "@/components/site/markdown";
import { PostCard, CategoryChip } from "@/components/site/post-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getPostBySlug, getPublishedPosts } from "@/lib/data";
import { formatDate, readingTime } from "@/lib/format";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Tulisan tidak ditemukan" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.cover_image
      ? { images: [{ url: post.cover_image }] }
      : undefined,
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getPublishedPosts({ category: post.category, limit: 4 }))
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      <article className="mx-auto max-w-6xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <Reveal>
          <Link
            href="/berita"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-forest-deep"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Kembali ke kabar dusun
          </Link>
        </Reveal>

        <div className="mx-auto mt-10 max-w-3xl">
          <Reveal delay={80}>
            <CategoryChip category={post.category} />
          </Reveal>
          <Reveal delay={160}>
            <h1 className="mt-5 font-display text-3xl font-semibold leading-[1.12] tracking-tight text-forest-deep md:text-5xl">
              {post.title}
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-terracotta" />
                {formatDate(post.published_at, { weekday: "long" })}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-terracotta" />
                {readingTime(post.content)}
              </span>
            </div>
          </Reveal>
        </div>

        {post.cover_image && (
          <Reveal delay={300}>
            <div className="relative mt-12 aspect-[21/10] overflow-hidden rounded-[2rem] border border-border">
              <ContentImage
                src={post.cover_image}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        )}

        <Reveal delay={360}>
          <div className="mx-auto mt-14 max-w-3xl">
            {post.excerpt && (
              <p className="mb-10 border-l-4 border-gold pl-6 font-display text-xl italic leading-relaxed text-forest-deep/90">
                {post.excerpt}
              </p>
            )}
            <Markdown content={post.content} />
          </div>
        </Reveal>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border/70 bg-paper py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <SectionHeading
              eyebrow="Tulisan Terkait"
              title="Kabar lain yang mungkin menarik"
              href="/berita"
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
