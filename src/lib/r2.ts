import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL
  );
}

function r2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export const ALLOWED_IMAGE_TYPES = Object.keys(EXT_BY_MIME);
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Buat presigned URL supaya browser admin bisa PUT langsung ke R2
 * tanpa melewati server Next.js.
 */
export async function createPresignedUpload(fileName: string, contentType: string) {
  const ext = EXT_BY_MIME[contentType];
  if (!ext) throw new Error("Tipe file tidak didukung");

  const base = fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48) || "gambar";
  const key = `uploads/${new Date().toISOString().slice(0, 10)}/${Date.now()}-${base}.${ext}`;

  const uploadUrl = await getSignedUrl(
    r2Client(),
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 600 }
  );

  return {
    uploadUrl,
    key,
    publicUrl: `${process.env.R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}`,
  };
}

/** Hapus objek R2 berdasarkan URL publiknya (dipakai saat konten dihapus). */
export async function deleteR2ObjectByUrl(publicUrl: string) {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!base || !publicUrl.startsWith(`${base}/`)) return; // bukan file R2 kita
  const key = publicUrl.slice(base.length + 1);
  try {
    await r2Client().send(
      new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key })
    );
  } catch {
    // Gagal hapus file lama tidak boleh menggagalkan aksi utama
  }
}
