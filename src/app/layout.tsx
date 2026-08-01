import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dusun Wohan — Desa Tampingan, Tegalrejo, Magelang",
    template: "%s — Dusun Wohan",
  },
  description:
    "Situs resmi Dusun Wohan, Desa Tampingan, Kecamatan Tegalrejo, Kabupaten Magelang. Kabar warga, kegiatan, agenda, galeri, dan potensi dusun.",
  keywords: ["Dusun Wohan", "Desa Tampingan", "Tegalrejo", "Magelang", "dusun", "desa"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextTopLoader
          color="#c2603a"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #c2603a, 0 0 5px #c2603a"
        />
        {children}
        <div className="grain-overlay" aria-hidden="true" />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
