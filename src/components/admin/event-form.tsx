"use client";

import { useActionState, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./image-upload";
import { saveEvent, type ActionState } from "@/app/admin/actions";
import { slugify, toDatetimeLocalWIB } from "@/lib/format";
import type { DusunEvent } from "@/lib/types";

const initialState: ActionState = { status: "idle", message: "" };

export function EventForm({ event }: { event?: DusunEvent }) {
  const [state, formAction, pending] = useActionState(saveEvent, initialState);
  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(event));
  const [cover, setCover] = useState(event?.cover_image ?? "");

  useEffect(() => {
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Nama acara</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="Contoh: Kerja Bakti Bersih Dusun"
            required
            className="h-12 rounded-xl bg-card font-display text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">
            Slug{" "}
            <span className="font-normal text-muted-foreground">
              (alamat URL)
            </span>
          </Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            className="rounded-xl bg-card font-mono text-sm"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="starts_at">Mulai (WIB)</Label>
            <Input
              id="starts_at"
              name="starts_at"
              type="datetime-local"
              defaultValue={toDatetimeLocalWIB(event?.starts_at)}
              required
              className="rounded-xl bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ends_at">
              Selesai{" "}
              <span className="font-normal text-muted-foreground">
                (opsional)
              </span>
            </Label>
            <Input
              id="ends_at"
              name="ends_at"
              type="datetime-local"
              defaultValue={toDatetimeLocalWIB(event?.ends_at)}
              className="rounded-xl bg-card"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Lokasi</Label>
          <Input
            id="location"
            name="location"
            defaultValue={event?.location ?? ""}
            placeholder="Contoh: Balai Dusun Wohan"
            className="rounded-xl bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={event?.description ?? ""}
            rows={8}
            placeholder="Jelaskan acaranya — apa, untuk siapa, perlu bawa apa… (mendukung Markdown)"
            className="rounded-xl bg-card leading-relaxed"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2 rounded-2xl border border-border bg-card p-6">
          <Label>Status</Label>
          <Select name="status" defaultValue={event?.status ?? "published"}>
            <SelectTrigger className="w-full rounded-xl bg-paper">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Terbit — tampil di situs</SelectItem>
              <SelectItem value="draft">Draft — belum tampil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
          <Label>Gambar sampul</Label>
          <ImageUpload value={cover} onChange={setCover} aspect="aspect-[3/2]" />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="w-full rounded-full bg-forest-deep text-base hover:bg-forest"
        >
          {pending ? (
            "Menyimpan…"
          ) : (
            <>
              <Save className="mr-1.5 size-4" />
              Simpan Agenda
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
