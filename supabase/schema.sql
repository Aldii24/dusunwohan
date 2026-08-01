-- ============================================================
-- Skema database Web Dusun Wohan
-- Jalankan di Supabase Dashboard > SQL Editor (sekali saja).
-- Konten (berita, agenda, galeri) sengaja kosong — diisi pengurus
-- lewat panel admin.
-- ============================================================

-- Trigger util: update kolom updated_at otomatis
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ------------------------------------------------------------
-- POSTS: berita, kegiatan, pengumuman, potensi dusun
-- ------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image text,
  category text not null default 'berita'
    check (category in ('berita', 'kegiatan', 'pengumuman', 'potensi')),
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.handle_updated_at();

-- ------------------------------------------------------------
-- EVENTS: agenda & acara mendatang
-- ------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  cover_image text,
  status text not null default 'published'
    check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger events_updated_at
  before update on public.events
  for each row execute function public.handle_updated_at();

-- ------------------------------------------------------------
-- GALLERY: foto-foto dusun
-- ------------------------------------------------------------
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  caption text,
  image_url text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- MESSAGES: pesan dari form kontak
-- ------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SITE SETTINGS: statistik, kontak & pengurus (diedit dari admin)
-- ------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- Publik hanya bisa baca konten published; admin (login) bisa semua.
-- ============================================================
alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.gallery_items enable row level security;
alter table public.messages enable row level security;
alter table public.site_settings enable row level security;

-- posts
create policy "Publik baca post published" on public.posts
  for select to anon using (status = 'published');
create policy "Admin akses penuh posts" on public.posts
  for all to authenticated using (true) with check (true);

-- events
create policy "Publik baca event published" on public.events
  for select to anon using (status = 'published');
create policy "Admin akses penuh events" on public.events
  for all to authenticated using (true) with check (true);

-- gallery
create policy "Publik baca galeri" on public.gallery_items
  for select to anon using (true);
create policy "Admin akses penuh galeri" on public.gallery_items
  for all to authenticated using (true) with check (true);

-- messages: publik hanya boleh kirim, tidak bisa baca
create policy "Publik kirim pesan" on public.messages
  for insert to anon with check (true);
create policy "Admin akses penuh pesan" on public.messages
  for all to authenticated using (true) with check (true);

-- site_settings
create policy "Publik baca settings" on public.site_settings
  for select to anon using (true);
create policy "Admin akses penuh settings" on public.site_settings
  for all to authenticated using (true) with check (true);

-- ============================================================
-- SEED: hanya pengaturan situs (statistik, kontak, pengurus).
-- Semuanya bisa diubah dari Admin > Pengaturan.
-- ============================================================
insert into public.site_settings (key, value) values
  ('stats', '{"penduduk": 487, "kk": 142, "rt": 4, "rw": 2, "luas": "±86 ha", "dukuh": "Wohan"}'),
  ('contact', '{"alamat": "Dusun Wohan, Desa Tampingan, Kec. Tegalrejo, Kab. Magelang, Jawa Tengah 56192", "whatsapp": "6281200000000", "email": "dusunwohan@gmail.com", "instagram": "dusunwohan"}'),
  ('officials', '[
    {"jabatan": "Kepala Dusun", "nama": "Bp. Kepala Dusun Wohan"},
    {"jabatan": "Ketua RW 01", "nama": "Bp. Ketua RW 01"},
    {"jabatan": "Ketua RW 02", "nama": "Bp. Ketua RW 02"},
    {"jabatan": "Ketua RT 01", "nama": "Bp. Ketua RT 01"},
    {"jabatan": "Ketua RT 02", "nama": "Bp. Ketua RT 02"},
    {"jabatan": "Ketua RT 03", "nama": "Bp. Ketua RT 03"},
    {"jabatan": "Ketua RT 04", "nama": "Bp. Ketua RT 04"},
    {"jabatan": "Ketua PKK", "nama": "Ibu Ketua PKK"},
    {"jabatan": "Ketua Karang Taruna", "nama": "Sdr. Ketua Karang Taruna"}
  ]')
on conflict (key) do nothing;

-- ============================================================
-- SELESAI. Berikutnya buat akun admin:
-- Dashboard > Authentication > Users > Add user (email + password,
-- centang "Auto confirm user").
-- ============================================================
