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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "./image-upload";
import { Markdown } from "@/components/site/markdown";
import { savePost, type ActionState } from "@/app/admin/actions";
import { slugify } from "@/lib/format";
import { CATEGORIES, CATEGORY_LABELS, type Post } from "@/lib/types";

const initialState: ActionState = { status: "idle", message: "" };

export function PostForm({ post }: { post?: Post }) {
  const [state, formAction, pending] = useActionState(savePost, initialState);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [content, setContent] = useState(post?.content ?? "");
  const [cover, setCover] = useState(post?.cover_image ?? "");

  useEffect(() => {
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
      {post && <input type="hidden" name="id" value={post.id} />}

      {/* Kolom utama */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Judul</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Judul kabar…"
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
            placeholder="judul-kabar"
            className="rounded-xl bg-card font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">
            Ringkasan{" "}
            <span className="font-normal text-muted-foreground">
              (tampil di kartu & mesin pencari)
            </span>
          </Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            defaultValue={post?.excerpt ?? ""}
            rows={2}
            maxLength={300}
            placeholder="Satu-dua kalimat inti kabar ini…"
            className="rounded-xl bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label>Isi tulisan</Label>
          <Tabs defaultValue="tulis">
            <TabsList>
              <TabsTrigger value="tulis">Tulis</TabsTrigger>
              <TabsTrigger value="pratinjau">Pratinjau</TabsTrigger>
            </TabsList>
            <TabsContent value="tulis">
              <Textarea
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                required
                placeholder={
                  "Tulis kabar di sini…\n\nDukung format Markdown:\n## Sub judul\n**tebal**, *miring*\n- daftar\n> kutipan"
                }
                className="rounded-xl bg-card font-mono text-sm leading-relaxed"
              />
            </TabsContent>
            <TabsContent value="pratinjau">
              <div className="min-h-[24rem] rounded-xl border border-border bg-card p-6">
                {content.trim() ? (
                  <Markdown content={content} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Belum ada isi untuk dipratinjau.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Kolom samping */}
      <div className="space-y-6">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select name="category" defaultValue={post?.category ?? "berita"}>
              <SelectTrigger className="w-full rounded-xl bg-paper">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select name="status" defaultValue={post?.status ?? "draft"}>
              <SelectTrigger className="w-full rounded-xl bg-paper">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft — belum tampil</SelectItem>
                <SelectItem value="published">Terbit — tampil di situs</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              Simpan Tulisan
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
