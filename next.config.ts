import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Gambar konten diunggah ke Cloudflare R2 (domain r2.dev / custom domain),
    // jadi izinkan semua host https untuk next/image.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    // Router cache: halaman yang baru dikunjungi dipakai ulang beberapa saat
    // sehingga navigasi bolak-balik terasa instan.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
