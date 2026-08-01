"use client";

/**
 * Kompres gambar di browser sebelum diunggah ke R2:
 * - Resize sisi terpanjang ke maks 1920px
 * - Konversi ke WebP (kualitas 0.82)
 *
 * Penting karena bucket r2.dev (gratis) dibatasi kecepatannya — file foto
 * ponsel/screenshot yang bermega-mega byte akan lambat dimuat pengunjung.
 * SVG & GIF (animasi) dilewatkan apa adanya.
 */
export async function compressImage(
  file: File,
  maxDim = 1920,
  quality = 0.82
): Promise<File> {
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // format tidak bisa didekode browser — unggah apa adanya
  }

  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality)
  );
  if (!blob) return file;

  // Kalau hasil kompresi malah lebih besar (mis. gambar sudah kecil), pakai asli
  if (blob.size >= file.size) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}
