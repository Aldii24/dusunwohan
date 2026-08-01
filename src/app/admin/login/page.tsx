import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { LoginForm } from "@/components/admin/login-form";
import { SetupGuide } from "@/components/admin/setup-guide";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Masuk Admin",
  robots: { index: false },
};

export default function LoginPage() {
  if (!isSupabaseConfigured()) return <SetupGuide />;

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* Panel kiri: form */}
      <div className="relative flex flex-col justify-center px-6 py-16 sm:px-12 md:px-20">
        <div className="kawung pointer-events-none absolute inset-0 opacity-[0.04]" />
        <div className="relative mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-forest-deep"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke situs
          </Link>

          <LogoMark className="size-12" />
          <h1 className="mt-6 font-display text-3xl font-semibold text-forest-deep">
            Panel Pengurus
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Masuk untuk mengelola kabar, agenda, galeri, dan pengaturan situs
            Dusun Wohan.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Panel kanan: ilustrasi */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/ph-sawah.svg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
        <blockquote className="absolute bottom-12 left-12 right-12 text-cream">
          <p className="font-display text-2xl font-medium italic leading-relaxed">
            &ldquo;Sing rukun karo tanggamu, sing guyub karo dusunmu.&rdquo;
          </p>
          <footer className="mt-3 text-sm text-cream/70">
            — Pitutur simbah, dijaga sampai sekarang
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
