"use client";

import { compressImage } from "./image-compress";

/**
 * Upload file dari browser langsung ke Cloudflare R2:
 * 1. Kompres/resize gambar di browser (maks 1920px, WebP).
 * 2. Minta presigned URL ke /api/upload (diverifikasi session admin).
 * 3. PUT file langsung ke R2 — tidak membebani server Next.js.
 * Mengembalikan URL publik gambar.
 */
export async function uploadImageToR2(rawFile: File): Promise<string> {
  const file = await compressImage(rawFile);
  let res: Response;
  try {
    res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        size: file.size,
      }),
    });
  } catch {
    throw new Error(
      "Tidak bisa menghubungi server. Periksa koneksi atau restart dev server."
    );
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Gagal menyiapkan upload.");
  }

  let put: Response;
  try {
    put = await fetch(data.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
  } catch {
    // fetch melempar TypeError ("Failed to fetch") saat request diblokir
    // sebelum sampai server — hampir selalu karena CORS bucket R2.
    throw new Error(
      "Browser diblokir saat mengirim file ke R2 (Failed to fetch). " +
        "Penyebab paling umum: kebijakan CORS bucket R2 belum disetel untuk origin " +
        `${window.location.origin}. Buka Cloudflare R2 → bucket → Settings → CORS policy ` +
        "(contoh lengkap ada di README). Bisa juga R2_ACCOUNT_ID salah."
    );
  }

  if (!put.ok) {
    throw new Error(
      `Upload ke R2 ditolak (HTTP ${put.status}). Periksa izin API token R2 ` +
        "(harus Object Read & Write) dan nama bucket di .env.local."
    );
  }

  return data.publicUrl as string;
}
