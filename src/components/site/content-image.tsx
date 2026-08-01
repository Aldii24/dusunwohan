import Image, { type ImageProps } from "next/image";

/**
 * next/image untuk gambar KONTEN (upload admin / URL luar).
 *
 * Gambar remote dilayani langsung tanpa optimizer Next karena optimizer
 * harus mengunduh ulang file dari sumbernya dengan batas waktu 7 detik —
 * bucket r2.dev yang di-rate-limit sering melewatinya sehingga gambar
 * gagal tampil (hanya alt). File sudah dikompres saat upload, jadi aman.
 * Gambar lokal (/images/…) tetap lewat pipeline normal.
 */
export function ContentImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const unoptimized = src.startsWith("http") || src.endsWith(".svg");
  return <Image {...props} unoptimized={unoptimized} />;
}
