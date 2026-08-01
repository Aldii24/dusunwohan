import type { Official, SiteContact, SiteStats } from "./types";

/**
 * Nilai bawaan untuk pengaturan situs — dipakai sebagai fallback ketika
 * baris site_settings belum ada. Konten editorial (berita, agenda, galeri)
 * TIDAK punya data contoh: seluruhnya diisi pengurus lewat panel admin.
 */

export const DEMO_STATS: SiteStats = {
  penduduk: 487,
  kk: 142,
  rt: 4,
  rw: 2,
  luas: "±86 ha",
  dukuh: "Wohan",
};

export const DEMO_CONTACT: SiteContact = {
  alamat:
    "Dusun Wohan, Desa Tampingan, Kec. Tegalrejo, Kab. Magelang, Jawa Tengah 56192",
  whatsapp: "6281200000000",
  email: "dusunwohan@gmail.com",
  instagram: "dusunwohan",
};

/** Susunan pengurus bawaan — edit lewat Admin → Pengaturan. */
export const DEMO_OFFICIALS: Official[] = [
  { jabatan: "Kepala Dusun", nama: "Bp. Kepala Dusun Wohan" },
  { jabatan: "Ketua RW 01", nama: "Bp. Ketua RW 01" },
  { jabatan: "Ketua RW 02", nama: "Bp. Ketua RW 02" },
  { jabatan: "Ketua RT 01", nama: "Bp. Ketua RT 01" },
  { jabatan: "Ketua RT 02", nama: "Bp. Ketua RT 02" },
  { jabatan: "Ketua RT 03", nama: "Bp. Ketua RT 03" },
  { jabatan: "Ketua RT 04", nama: "Bp. Ketua RT 04" },
  { jabatan: "Ketua PKK", nama: "Ibu Ketua PKK" },
  { jabatan: "Ketua Karang Taruna", nama: "Sdr. Ketua Karang Taruna" },
];
