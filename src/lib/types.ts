export type PostCategory = "berita" | "kegiatan" | "pengumuman" | "potensi";
export type PublishStatus = "draft" | "published";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: PostCategory;
  status: PublishStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DusunEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  cover_image: string | null;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  caption: string | null;
  image_url: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  contact: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteStats {
  penduduk: number;
  kk: number;
  rt: number;
  rw: number;
  luas: string;
  dukuh: string;
}

export interface SiteContact {
  alamat: string;
  whatsapp: string;
  email: string;
  instagram: string;
}

/** Pengurus dusun (Kepala Dusun, Ketua RT/RW, Karang Taruna, dst.) */
export interface Official {
  jabatan: string;
  nama: string;
}

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  berita: "Berita",
  kegiatan: "Kegiatan",
  pengumuman: "Pengumuman",
  potensi: "Potensi & UMKM",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as PostCategory[];
