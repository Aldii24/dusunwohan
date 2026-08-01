-- ============================================================
-- PEMBERSIH KONTEN CONTOH
-- Jalankan SEKALI di Supabase Dashboard > SQL Editor untuk
-- menghapus berita/agenda/galeri contoh hasil seed schema.sql lama.
-- Konten yang dibuat sendiri lewat admin TIDAK ikut terhapus
-- (penghapusan ditarget berdasarkan slug/gambar seed).
-- ============================================================

delete from public.posts where slug in (
  'kerja-bakti-bersih-dusun-sambut-kemerdekaan',
  'panen-raya-padi-hasil-meningkat',
  'posyandu-balita-lansia-bulan-ini',
  'pemberitahuan-perbaikan-jalan-dusun',
  'keripik-camilan-umkm-ibu-ibu-wohan',
  'draft-rencana-lomba-17an'
);

delete from public.events where slug in (
  'tirakatan-malam-kemerdekaan',
  'lomba-17an-dusun-wohan',
  'pengajian-rutin-malam-jumat',
  'merti-dusun-kenduri-hasil-bumi',
  'kerja-bakti-normalisasi-irigasi'
);

-- Foto galeri seed memakai ilustrasi bawaan /images/ph-*.svg —
-- foto unggahan admin (URL R2) tidak tersentuh.
delete from public.gallery_items where image_url like '/images/ph-%';
