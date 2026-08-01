# 🏡 Situs Dusun Wohan

Situs resmi **Dusun Wohan, Desa Tampingan, Kecamatan Tegalrejo, Kabupaten Magelang** — profil dusun lengkap dengan CMS untuk pengurus: kabar/berita, kegiatan, pengumuman, agenda & acara mendatang, galeri foto, pesan warga, dan pengaturan situs.

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions) |
| Database & Auth | Supabase (PostgreSQL + RLS, email/password) |
| Penyimpanan gambar | Cloudflare R2 via **presigned URL** (upload langsung dari browser) |
| UI | Tailwind CSS v4 + shadcn/ui |
| Tipografi | Fraunces + Plus Jakarta Sans |

> **Mode demo:** tanpa konfigurasi apa pun, situs langsung jalan dengan konten contoh (`npm run dev`). Supabase & R2 baru dibutuhkan untuk CMS admin dan konten sungguhan.

---

## 1. Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000 — situs tampil dengan data demo.

## 2. Setup Supabase (database + auth)

1. Buat project di [supabase.com](https://supabase.com) (gratis).
2. Buka **SQL Editor**, tempel seluruh isi [`supabase/schema.sql`](supabase/schema.sql), jalankan. Ini membuat tabel (`posts`, `events`, `gallery_items`, `messages`, `site_settings`), kebijakan RLS, dan konten seed.
3. Buat akun admin: **Authentication → Users → Add user** — isi email & password, centang **Auto confirm user**.
4. Salin kredensial dari **Project Settings → API**:

```bash
cp .env.example .env.local
```

Isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Restart `npm run dev` → login di `/admin/login`.

**Keamanan:** publik hanya bisa membaca konten `published` dan mengirim pesan kontak (dibatasi RLS). Semua operasi tulis butuh login admin.

## 3. Setup Cloudflare R2 (upload gambar)

Upload gambar (sampul berita/agenda & galeri) berjalan **langsung dari browser admin ke R2** memakai presigned URL — file tidak melewati server Next.js.

1. Di dashboard Cloudflare, buka **R2 Object Storage** → **Create bucket** (misal `wohan-media`).
2. Aktifkan akses publik bucket: **Settings → Public access → r2.dev subdomain → Allow** (atau sambungkan custom domain). Catat URL-nya, misal `https://pub-xxxx.r2.dev`.
3. Buat API token: **R2 → Manage R2 API Tokens → Create API Token** dengan izin **Object Read & Write** untuk bucket tersebut. Catat *Access Key ID* dan *Secret Access Key*.
4. Pasang **CORS** pada bucket (Settings → CORS policy) supaya browser bisa PUT langsung:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://domain-anda.com"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

5. Lengkapi `.env.local`:

```env
R2_ACCOUNT_ID=...        # Account ID Cloudflare (di halaman utama R2)
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=wohan-media
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

Alur upload: browser admin → `POST /api/upload` (server memverifikasi session Supabase, membuat presigned URL) → browser `PUT` file langsung ke R2 → URL publik disimpan di database. Saat konten dihapus, file R2-nya ikut dibersihkan.

## 4. Struktur halaman

**Publik** — `/` beranda · `/profil` · `/berita` (+filter kategori, `/berita/[slug]`) · `/agenda` (+`/agenda/[slug]`) · `/galeri` · `/kontak`

**Admin** (`/admin`, dilindungi login) — Dashboard · Kabar & Berita (CRUD + editor Markdown + pratinjau) · Agenda · Galeri (multi-upload) · Pesan Masuk · Pengaturan (statistik & kontak).

## 5. Deploy (Vercel)

1. Push repo ke GitHub, import di [vercel.com](https://vercel.com).
2. Isi semua environment variable dari `.env.local` di project settings.
3. Tambahkan domain produksi ke `AllowedOrigins` CORS bucket R2.

## Catatan konten

- Konten seed (berita, agenda, galeri) adalah **contoh** — hapus/edit lewat admin.
- Nama pengurus di halaman Profil (`src/app/(public)/profil/page.tsx`, konstanta `PERANGKAT`) masih placeholder — sesuaikan dengan susunan pengurus asli.
- Statistik dusun & kontak (WhatsApp, email, Instagram, alamat) diedit dari **Admin → Pengaturan**.
