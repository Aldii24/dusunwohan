import { createSupabaseServerClient } from "./supabase/server";
import type {
  ContactMessage,
  DusunEvent,
  GalleryItem,
  Official,
  Post,
  SiteContact,
  SiteStats,
} from "./types";
import { DEMO_CONTACT, DEMO_OFFICIALS, DEMO_STATS } from "./demo-data";

/** Data layer khusus area admin — selalu lewat client ber-session. */

export async function adminGetPosts(): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Post[];
}

export interface AdminPaged<T> {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
}

async function pagedTable<T>(
  table: string,
  orderBy: string,
  ascending: boolean,
  page: number,
  pageSize: number
): Promise<AdminPaged<T>> {
  const supabase = await createSupabaseServerClient();

  const { count } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pageCount);
  const from = (p - 1) * pageSize;

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(orderBy, { ascending })
    .range(from, from + pageSize - 1);

  if (error) throw new Error(error.message);
  return { items: (data ?? []) as T[], total, page: p, pageCount };
}

export async function adminGetPostsPage(
  page: number,
  pageSize = 10
): Promise<AdminPaged<Post>> {
  return pagedTable<Post>("posts", "created_at", false, page, pageSize);
}

export async function adminGetEventsPage(
  page: number,
  pageSize = 10
): Promise<AdminPaged<DusunEvent>> {
  return pagedTable<DusunEvent>("events", "starts_at", false, page, pageSize);
}

export async function adminGetMessagesPage(
  page: number,
  pageSize = 10
): Promise<AdminPaged<ContactMessage>> {
  return pagedTable<ContactMessage>("messages", "created_at", false, page, pageSize);
}

export async function adminGetPostById(id: string): Promise<Post | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data as Post | null;
}

export async function adminGetEvents(): Promise<DusunEvent[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as DusunEvent[];
}

export async function adminGetEventById(id: string): Promise<DusunEvent | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data as DusunEvent | null;
}

export async function adminGetGallery(): Promise<GalleryItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as GalleryItem[];
}

export async function adminGetMessages(): Promise<ContactMessage[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as ContactMessage[];
}

export async function adminGetSettings(): Promise<{
  stats: SiteStats;
  contact: SiteContact;
  officials: Official[];
}> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("site_settings").select("key,value");
  const map = new Map((data ?? []).map((row) => [row.key, row.value]));

  const officials = map.get("officials") as Official[] | undefined;

  return {
    stats: { ...DEMO_STATS, ...((map.get("stats") as Partial<SiteStats>) ?? {}) },
    contact: {
      ...DEMO_CONTACT,
      ...((map.get("contact") as Partial<SiteContact>) ?? {}),
    },
    officials:
      Array.isArray(officials) && officials.length > 0
        ? officials
        : DEMO_OFFICIALS,
  };
}

export interface AdminCounts {
  posts: number;
  drafts: number;
  upcomingEvents: number;
  gallery: number;
  unreadMessages: number;
}

export async function adminGetCounts(): Promise<AdminCounts> {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();

  const [posts, drafts, events, gallery, unread] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .gte("starts_at", now)
      .eq("status", "published"),
    supabase.from("gallery_items").select("id", { count: "exact", head: true }),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  return {
    posts: posts.count ?? 0,
    drafts: drafts.count ?? 0,
    upcomingEvents: events.count ?? 0,
    gallery: gallery.count ?? 0,
    unreadMessages: unread.count ?? 0,
  };
}
