"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteR2ObjectByUrl } from "@/lib/r2";
import { fromDatetimeLocalWIB, slugify } from "@/lib/format";
import { CATEGORIES, type PostCategory } from "@/lib/types";

export interface ActionState {
  status: "idle" | "success" | "error";
  message: string;
}

const ok = (message: string): ActionState => ({ status: "success", message });
const err = (message: string): ActionState => ({ status: "error", message });

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { supabase, user };
}

/** Flush cache halaman publik setelah konten berubah. */
function revalidatePublic() {
  revalidatePath("/", "layout");
}

// ============ AUTH ============

export async function signIn(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return err("Email dan kata sandi wajib diisi.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return err("Email atau kata sandi salah.");

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ============ POSTS ============

export async function savePost(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireUser();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "berita") as PostCategory;
  const status = String(formData.get("status") ?? "draft");
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const coverImage = String(formData.get("cover_image") ?? "").trim();

  if (!title) return err("Judul wajib diisi.");
  if (!content.trim()) return err("Isi tulisan masih kosong.");
  if (!CATEGORIES.includes(category)) return err("Kategori tidak valid.");

  const slug = slugify(rawSlug || title);
  if (!slug) return err("Slug tidak valid.");

  const payload = {
    title,
    slug,
    category,
    status: status === "published" ? "published" : "draft",
    excerpt: excerpt || null,
    content,
    cover_image: coverImage || null,
  };

  if (id) {
    const { data: existing } = await supabase
      .from("posts")
      .select("status, published_at")
      .eq("id", id)
      .maybeSingle();

    const published_at =
      payload.status === "published"
        ? (existing?.published_at ?? new Date().toISOString())
        : existing?.published_at ?? null;

    const { error } = await supabase
      .from("posts")
      .update({ ...payload, published_at })
      .eq("id", id);
    if (error)
      return err(
        error.code === "23505" ? "Slug sudah dipakai tulisan lain." : error.message
      );
  } else {
    const { error } = await supabase.from("posts").insert({
      ...payload,
      published_at: payload.status === "published" ? new Date().toISOString() : null,
    });
    if (error)
      return err(
        error.code === "23505" ? "Slug sudah dipakai tulisan lain." : error.message
      );
  }

  revalidatePublic();
  revalidatePath("/admin/berita");
  redirect("/admin/berita?saved=1");
}

export async function deletePost(id: string): Promise<ActionState> {
  const { supabase } = await requireUser();

  const { data: post } = await supabase
    .from("posts")
    .select("cover_image")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return err(error.message);

  if (post?.cover_image) await deleteR2ObjectByUrl(post.cover_image);

  revalidatePublic();
  revalidatePath("/admin/berita");
  return ok("Tulisan dihapus.");
}

// ============ EVENTS ============

export async function saveEvent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireUser();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const startsAtRaw = String(formData.get("starts_at") ?? "");
  const endsAtRaw = String(formData.get("ends_at") ?? "");
  const status = String(formData.get("status") ?? "published");
  const coverImage = String(formData.get("cover_image") ?? "").trim();

  if (!title) return err("Nama acara wajib diisi.");
  const starts_at = fromDatetimeLocalWIB(startsAtRaw);
  if (!starts_at) return err("Waktu mulai wajib diisi.");
  const ends_at = fromDatetimeLocalWIB(endsAtRaw);
  if (ends_at && ends_at < starts_at)
    return err("Waktu selesai tidak boleh sebelum waktu mulai.");

  const slug = slugify(rawSlug || title);
  if (!slug) return err("Slug tidak valid.");

  const payload = {
    title,
    slug,
    description,
    location: location || null,
    starts_at,
    ends_at,
    status: status === "draft" ? "draft" : "published",
    cover_image: coverImage || null,
  };

  const { error } = id
    ? await supabase.from("events").update(payload).eq("id", id)
    : await supabase.from("events").insert(payload);

  if (error)
    return err(
      error.code === "23505" ? "Slug sudah dipakai acara lain." : error.message
    );

  revalidatePublic();
  revalidatePath("/admin/agenda");
  redirect("/admin/agenda?saved=1");
}

export async function deleteEvent(id: string): Promise<ActionState> {
  const { supabase } = await requireUser();

  const { data: event } = await supabase
    .from("events")
    .select("cover_image")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return err(error.message);

  if (event?.cover_image) await deleteR2ObjectByUrl(event.cover_image);

  revalidatePublic();
  revalidatePath("/admin/agenda");
  return ok("Agenda dihapus.");
}

// ============ GALLERY ============

export async function addGalleryItem(input: {
  image_url: string;
  title?: string;
  caption?: string;
}): Promise<ActionState> {
  const { supabase } = await requireUser();
  if (!input.image_url) return err("URL gambar kosong.");

  const { error } = await supabase.from("gallery_items").insert({
    image_url: input.image_url,
    title: input.title?.trim() || null,
    caption: input.caption?.trim() || null,
  });
  if (error) return err(error.message);

  revalidatePublic();
  revalidatePath("/admin/galeri");
  return ok("Foto ditambahkan ke galeri.");
}

export async function updateGalleryItem(
  id: string,
  input: { title?: string; caption?: string }
): Promise<ActionState> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("gallery_items")
    .update({
      title: input.title?.trim() || null,
      caption: input.caption?.trim() || null,
    })
    .eq("id", id);
  if (error) return err(error.message);

  revalidatePublic();
  revalidatePath("/admin/galeri");
  return ok("Keterangan foto diperbarui.");
}

export async function deleteGalleryItem(id: string): Promise<ActionState> {
  const { supabase } = await requireUser();

  const { data: item } = await supabase
    .from("gallery_items")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) return err(error.message);

  if (item?.image_url) await deleteR2ObjectByUrl(item.image_url);

  revalidatePublic();
  revalidatePath("/admin/galeri");
  return ok("Foto dihapus.");
}

// ============ MESSAGES ============

export async function setMessageRead(
  id: string,
  isRead: boolean
): Promise<ActionState> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("messages")
    .update({ is_read: isRead })
    .eq("id", id);
  if (error) return err(error.message);
  revalidatePath("/admin/pesan");
  return ok(isRead ? "Ditandai sudah dibaca." : "Ditandai belum dibaca.");
}

export async function deleteMessage(id: string): Promise<ActionState> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) return err(error.message);
  revalidatePath("/admin/pesan");
  return ok("Pesan dihapus.");
}

// ============ SETTINGS ============

export async function saveSettings(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireUser();

  const stats = {
    penduduk: Number(formData.get("penduduk") ?? 0) || 0,
    kk: Number(formData.get("kk") ?? 0) || 0,
    rt: Number(formData.get("rt") ?? 0) || 0,
    rw: Number(formData.get("rw") ?? 0) || 0,
    luas: String(formData.get("luas") ?? "").trim(),
    dukuh: "Wohan",
  };
  const contact = {
    alamat: String(formData.get("alamat") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").replace(/\D/g, ""),
    email: String(formData.get("email") ?? "").trim(),
    instagram: String(formData.get("instagram") ?? "").replace(/^@/, "").trim(),
  };

  // Pengurus dusun: pasangan input official_jabatan[i] + official_nama[i]
  const jabatans = formData.getAll("official_jabatan").map((v) => String(v).trim());
  const namas = formData.getAll("official_nama").map((v) => String(v).trim());
  const officials = jabatans
    .map((jabatan, i) => ({
      jabatan: jabatan.slice(0, 60),
      nama: (namas[i] ?? "").slice(0, 80),
    }))
    .filter((o) => o.jabatan && o.nama);

  const { error: e1 } = await supabase
    .from("site_settings")
    .upsert({ key: "stats", value: stats });
  const { error: e2 } = await supabase
    .from("site_settings")
    .upsert({ key: "contact", value: contact });
  const { error: e3 } = await supabase
    .from("site_settings")
    .upsert({ key: "officials", value: officials });

  if (e1 || e2 || e3) return err((e1 ?? e2 ?? e3)!.message);

  revalidatePublic();
  revalidatePath("/admin/pengaturan");
  return ok("Pengaturan tersimpan.");
}
