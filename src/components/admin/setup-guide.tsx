import { AlertTriangle } from "lucide-react";

/** Ditampilkan di area admin saat env Supabase belum diisi. */
export function SetupGuide() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 md:p-12">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gold-soft text-terracotta">
          <AlertTriangle className="size-6" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-forest-deep md:text-3xl">
          Supabase belum dikonfigurasi
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Area admin membutuhkan database dan autentikasi Supabase. Situs publik
          sementara berjalan dengan konten demo.
        </p>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-foreground/85">
          <li>
            Buat project gratis di{" "}
            <span className="font-semibold">supabase.com</span>, lalu jalankan
            isi file <code className="rounded bg-muted px-1.5 py-0.5">supabase/schema.sql</code>{" "}
            di SQL Editor.
          </li>
          <li>
            Buat akun admin di{" "}
            <span className="font-semibold">Authentication → Users → Add user</span>{" "}
            (centang <em>Auto confirm</em>).
          </li>
          <li>
            Salin <code className="rounded bg-muted px-1.5 py-0.5">.env.example</code>{" "}
            menjadi <code className="rounded bg-muted px-1.5 py-0.5">.env.local</code>,
            isi URL dan anon key dari Project Settings → API.
          </li>
          <li>
            (Untuk upload gambar) Isi juga kredensial Cloudflare R2 — lihat
            panduan lengkap di <code className="rounded bg-muted px-1.5 py-0.5">README.md</code>.
          </li>
          <li>Restart server development, lalu buka kembali halaman ini.</li>
        </ol>
      </div>
    </div>
  );
}
