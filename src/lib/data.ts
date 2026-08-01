import { createPublicClient } from "./supabase/public";
import { DEMO_CONTACT, DEMO_OFFICIALS, DEMO_STATS } from "./demo-data";
import type {
  DusunEvent,
  GalleryItem,
  Official,
  Post,
  PostCategory,
  SiteContact,
  SiteStats,
} from "./types";

/**
 * Data layer halaman publik. Seluruh konten (berita, agenda, galeri)
 * berasal dari database — tidak ada konten contoh; kalau Supabase belum
 * dikonfigurasi, halaman menampilkan empty state.
 */

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
}

const EMPTY_PAGE = { items: [], total: 0, page: 1, pageCount: 1 };

export async function getPublishedPosts(opts?: {
  category?: PostCategory;
  limit?: number;
}): Promise<Post[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (opts?.category) query = query.eq("category", opts.category);
  if (opts?.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) {
    console.error("getPublishedPosts:", error.message);
    return [];
  }
  return data as Post[];
}

export async function getPublishedPostsPage(opts: {
  category?: PostCategory;
  page: number;
  pageSize: number;
}): Promise<Paged<Post>> {
  const supabase = createPublicClient();
  if (!supabase) return EMPTY_PAGE;

  // Hitung total dulu supaya nomor halaman bisa di-clamp dengan aman.
  let countQuery = supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");
  if (opts.category) countQuery = countQuery.eq("category", opts.category);
  const { count } = await countQuery;

  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / opts.pageSize));
  const page = Math.min(Math.max(1, opts.page), pageCount);
  const from = (page - 1) * opts.pageSize;

  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, from + opts.pageSize - 1);
  if (opts.category) query = query.eq("category", opts.category);

  const { data, error } = await query;
  if (error) {
    console.error("getPublishedPostsPage:", error.message);
    return EMPTY_PAGE;
  }
  return { items: data as Post[], total, page, pageCount };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("getPostBySlug:", error.message);
    return null;
  }
  return data as Post | null;
}

export async function getUpcomingEvents(limit?: number): Promise<DusunEvent[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("getUpcomingEvents:", error.message);
    return [];
  }
  return data as DusunEvent[];
}

export async function getPastEvents(limit = 6): Promise<DusunEvent[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .lt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getPastEvents:", error.message);
    return [];
  }
  return data as DusunEvent[];
}

export async function getEventBySlug(slug: string): Promise<DusunEvent | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("getEventBySlug:", error.message);
    return null;
  }
  return data as DusunEvent | null;
}

export async function getGalleryItems(limit?: number): Promise<GalleryItem[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("getGalleryItems:", error.message);
    return [];
  }
  return data as GalleryItem[];
}

export async function getGalleryItemsPage(
  page: number,
  pageSize: number
): Promise<Paged<GalleryItem>> {
  const supabase = createPublicClient();
  if (!supabase) return EMPTY_PAGE;

  const { count } = await supabase
    .from("gallery_items")
    .select("id", { count: "exact", head: true });

  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pageCount);
  const from = (p - 1) * pageSize;

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    console.error("getGalleryItemsPage:", error.message);
    return EMPTY_PAGE;
  }
  return { items: data as GalleryItem[], total, page: p, pageCount };
}

export async function getSiteStats(): Promise<SiteStats> {
  const supabase = createPublicClient();
  if (!supabase) return DEMO_STATS;

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "stats")
    .maybeSingle();

  return { ...DEMO_STATS, ...((data?.value as Partial<SiteStats>) ?? {}) };
}

export async function getSiteOfficials(): Promise<Official[]> {
  const supabase = createPublicClient();
  if (!supabase) return DEMO_OFFICIALS;

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "officials")
    .maybeSingle();

  const officials = data?.value as Official[] | undefined;
  return Array.isArray(officials) && officials.length > 0
    ? officials
    : DEMO_OFFICIALS;
}

export async function getSiteContact(): Promise<SiteContact> {
  const supabase = createPublicClient();
  if (!supabase) return DEMO_CONTACT;

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact")
    .maybeSingle();

  return { ...DEMO_CONTACT, ...((data?.value as Partial<SiteContact>) ?? {}) };
}
