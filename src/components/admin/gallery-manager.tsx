"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContentImage } from "@/components/site/content-image";
import { DeleteButton } from "./delete-button";
import {
  addGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
} from "@/app/admin/actions";
import { uploadImageToR2 } from "@/lib/upload";
import { formatDateShort } from "@/lib/format";
import type { GalleryItem } from "@/lib/types";

interface PendingUpload {
  file: File;
  previewUrl: string;
  title: string;
  caption: string;
}

const fileNameToTitle = (name: string) =>
  name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [pendingEdit, startEditTransition] = useTransition();

  // Bersihkan object URL preview saat daftar berubah/di-unmount
  useEffect(() => {
    return () => pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files)
      .slice(0, 10)
      .map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        title: fileNameToTitle(file.name),
        caption: "",
      }));
    setPending(list);
    if (inputRef.current) inputRef.current.value = "";
  };

  const updatePending = (
    index: number,
    field: "title" | "caption",
    value: string
  ) => {
    setPending((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const removePending = (index: number) => {
    setPending((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const closePendingDialog = () => {
    pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPending([]);
    setProgress(0);
  };

  const handleUploadAll = async () => {
    if (pending.some((p) => !p.title.trim())) {
      toast.error("Semua foto harus diberi judul dulu.");
      return;
    }
    setUploading(true);
    setProgress(0);
    let ok = 0;

    for (const [i, item] of pending.entries()) {
      try {
        const url = await uploadImageToR2(item.file);
        const result = await addGalleryItem({
          image_url: url,
          title: item.title,
          caption: item.caption,
        });
        if (result.status === "error") throw new Error(result.message);
        ok++;
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : `Gagal mengunggah ${item.file.name}`
        );
      } finally {
        setProgress(i + 1);
      }
    }

    setUploading(false);
    if (ok > 0) toast.success(`${ok} foto berhasil diunggah.`);
    closePendingDialog();
  };

  const submitEdit = (formData: FormData) => {
    if (!editing) return;
    startEditTransition(async () => {
      const result = await updateGalleryItem(editing.id, {
        title: String(formData.get("title") ?? ""),
        caption: String(formData.get("caption") ?? ""),
      });
      if (result.status === "success") {
        toast.success(result.message);
        setEditing(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mb-8 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-paper py-12 text-muted-foreground transition-colors hover:border-forest/40 hover:text-forest"
      >
        <ImagePlus className="size-8" />
        <span className="text-sm font-medium">
          Pilih foto (bisa banyak sekaligus) — judul & keterangan diisi sebelum
          diunggah
        </span>
        <span className="text-xs">
          JPG · PNG · WebP · dikompres otomatis saat unggah
        </span>
      </button>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3] bg-secondary">
                <ContentImage
                  src={item.image_url}
                  alt={item.title ?? "Foto galeri"}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-2 p-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-forest-deep">
                    {item.title || "Tanpa judul"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateShort(item.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground"
                    aria-label="Edit keterangan"
                    onClick={() => setEditing(item)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <DeleteButton
                    action={() => deleteGalleryItem(item.id)}
                    title="Hapus foto ini?"
                    description="Foto akan dihapus dari galeri dan penyimpanan R2."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Galeri masih kosong — unggah foto pertama dusun!
        </p>
      )}

      {/* Dialog isi judul & keterangan sebelum upload */}
      <Dialog
        open={pending.length > 0}
        onOpenChange={(o) => {
          if (!o && !uploading) closePendingDialog();
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              Lengkapi keterangan foto
            </DialogTitle>
            <DialogDescription>
              Isi judul (wajib) dan keterangan untuk tiap foto, lalu klik
              unggah.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {pending.map((p, i) => (
              <div
                key={p.previewUrl}
                className="flex gap-4 rounded-2xl border border-border bg-paper p-4"
              >
                {/* preview file lokal — object URL, bukan next/image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.previewUrl}
                  alt=""
                  className="size-20 shrink-0 rounded-xl border border-border object-cover"
                />
                <div className="min-w-0 flex-1 space-y-2.5">
                  <Input
                    value={p.title}
                    onChange={(e) => updatePending(i, "title", e.target.value)}
                    placeholder="Judul foto (wajib)"
                    maxLength={120}
                    disabled={uploading}
                    className="rounded-xl bg-card"
                  />
                  <Input
                    value={p.caption}
                    onChange={(e) => updatePending(i, "caption", e.target.value)}
                    placeholder="Keterangan (opsional) — cerita di balik foto"
                    maxLength={200}
                    disabled={uploading}
                    className="rounded-xl bg-card"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={uploading}
                  className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Buang foto ini"
                  onClick={() => removePending(i)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              {uploading
                ? `Mengunggah ${progress}/${pending.length}…`
                : `${pending.length} foto siap diunggah`}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                className="rounded-full"
                onClick={closePendingDialog}
              >
                Batal
              </Button>
              <Button
                type="button"
                disabled={uploading || pending.length === 0}
                className="rounded-full bg-forest-deep hover:bg-forest"
                onClick={handleUploadAll}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Mengunggah…
                  </>
                ) : (
                  "Unggah Semua"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog edit keterangan foto yang sudah ada */}
      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Edit keterangan foto</DialogTitle>
          </DialogHeader>
          {editing && (
            <form action={submitEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="g-title">Judul</Label>
                <Input
                  id="g-title"
                  name="title"
                  defaultValue={editing.title ?? ""}
                  placeholder="Judul singkat foto"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="g-caption">Keterangan</Label>
                <Input
                  id="g-caption"
                  name="caption"
                  defaultValue={editing.caption ?? ""}
                  placeholder="Cerita di balik foto ini…"
                  className="rounded-xl"
                />
              </div>
              <Button
                type="submit"
                disabled={pendingEdit}
                className="w-full rounded-full bg-forest-deep hover:bg-forest"
              >
                {pendingEdit ? "Menyimpan…" : "Simpan"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
