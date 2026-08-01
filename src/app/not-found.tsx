import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="kawung pointer-events-none absolute inset-0 opacity-[0.05]" />
      <p className="font-display text-[clamp(5rem,20vw,10rem)] font-bold leading-none text-forest-deep/15">
        404
      </p>
      <h1 className="-mt-6 font-display text-3xl font-semibold text-forest-deep md:text-4xl">
        Halaman ini tersesat di pematang sawah
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Alamat yang Anda tuju tidak ditemukan. Mari kembali ke jalan utama
        dusun.
      </p>
      <Button
        asChild
        size="lg"
        className="mt-8 rounded-full bg-forest-deep px-7 hover:bg-forest"
      >
        <Link href="/">
          <ArrowLeft className="mr-1 size-4" />
          Kembali ke Beranda
        </Link>
      </Button>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh] opacity-60">
        <Image
          src="/images/hero-panorama.svg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>
    </div>
  );
}
