import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ALLOWED_IMAGE_TYPES,
  createPresignedUpload,
  isR2Configured,
  MAX_UPLOAD_BYTES,
} from "@/lib/r2";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Minta presigned URL untuk upload langsung browser → Cloudflare R2.
 * Hanya untuk admin yang sudah login.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 503 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  if (!isR2Configured()) {
    return NextResponse.json(
      {
        error:
          "Cloudflare R2 belum dikonfigurasi. Isi variabel R2_* di .env.local terlebih dahulu.",
      },
      { status: 503 }
    );
  }

  let body: { fileName?: string; contentType?: string; size?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const { fileName, contentType, size } = body;
  if (!fileName || !contentType) {
    return NextResponse.json(
      { error: "fileName dan contentType wajib diisi." },
      { status: 400 }
    );
  }
  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "Tipe file tidak didukung. Gunakan JPG, PNG, WebP, GIF, atau AVIF." },
      { status: 400 }
    );
  }
  if (size && size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Ukuran file maksimal 10 MB." },
      { status: 400 }
    );
  }

  try {
    const result = await createPresignedUpload(fileName, contentType);
    return NextResponse.json(result);
  } catch (e) {
    console.error("upload route:", e);
    return NextResponse.json(
      { error: "Gagal membuat URL upload." },
      { status: 500 }
    );
  }
}
