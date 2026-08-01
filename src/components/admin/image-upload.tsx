"use client";

import { useRef, useState } from "react";
import { ContentImage } from "@/components/site/content-image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadImageToR2 } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  /** URL gambar saat ini (dikirim lewat hidden input `name`). */
  value: string;
  onChange: (url: string) => void;
  name?: string;
  className?: string;
  aspect?: string;
}

/**
 * Upload sampul: pilih file → presigned URL → PUT langsung ke R2.
 * Bisa juga menempel URL gambar eksternal secara manual.
 */
export function ImageUpload({
  value,
  onChange,
  name = "cover_image",
  className,
  aspect = "aspect-[21/10]",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToR2(file);
      onChange(url);
      toast.success("Gambar berhasil diunggah.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input type="hidden" name={name} value={value} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-border",
            aspect
          )}
        >
          <ContentImage
            src={value}
            alt="Sampul"
            fill
            sizes="600px"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-full"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Ganti
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-full text-destructive"
              onClick={() => onChange("")}
            >
              <X className="mr-1 size-3.5" />
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-paper text-muted-foreground transition-colors hover:border-forest/40 hover:text-forest",
            aspect
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="size-7 animate-spin" />
              <span className="text-sm font-medium">Mengunggah ke R2…</span>
            </>
          ) : (
            <>
              <ImagePlus className="size-7" />
              <span className="text-sm font-medium">
                Klik untuk unggah gambar sampul
              </span>
              <span className="text-xs">JPG · PNG · WebP · maks 10 MB</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
