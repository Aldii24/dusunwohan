"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import type { Official, SiteContact, SiteStats } from "@/lib/types";

const initialState: ActionState = { status: "idle", message: "" };

export function SettingsForm({
  stats,
  contact,
  officials: initialOfficials,
}: {
  stats: SiteStats;
  contact: SiteContact;
  officials: Official[];
}) {
  const [state, formAction, pending] = useActionState(saveSettings, initialState);
  const [officials, setOfficials] = useState<Official[]>(
    initialOfficials.length > 0
      ? initialOfficials
      : [{ jabatan: "", nama: "" }]
  );

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  const updateOfficial = (
    index: number,
    field: keyof Official,
    value: string
  ) => {
    setOfficials((prev) =>
      prev.map((o, i) => (i === index ? { ...o, [field]: value } : o))
    );
  };

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-5 rounded-2xl border border-border bg-card p-7">
        <h2 className="font-display text-lg font-semibold text-forest-deep">
          Statistik Dusun
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="penduduk">Jumlah penduduk</Label>
            <Input
              id="penduduk"
              name="penduduk"
              type="number"
              min={0}
              defaultValue={stats.penduduk}
              className="rounded-xl bg-paper"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kk">Kepala keluarga</Label>
            <Input
              id="kk"
              name="kk"
              type="number"
              min={0}
              defaultValue={stats.kk}
              className="rounded-xl bg-paper"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rt">Jumlah RT</Label>
            <Input
              id="rt"
              name="rt"
              type="number"
              min={0}
              defaultValue={stats.rt}
              className="rounded-xl bg-paper"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rw">Jumlah RW</Label>
            <Input
              id="rw"
              name="rw"
              type="number"
              min={0}
              defaultValue={stats.rw}
              className="rounded-xl bg-paper"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="luas">Luas wilayah</Label>
            <Input
              id="luas"
              name="luas"
              defaultValue={stats.luas}
              placeholder="Contoh: ±86 ha"
              className="rounded-xl bg-paper"
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-card p-7">
        <h2 className="font-display text-lg font-semibold text-forest-deep">
          Kontak & Alamat
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat lengkap</Label>
            <Textarea
              id="alamat"
              name="alamat"
              defaultValue={contact.alamat}
              rows={3}
              className="rounded-xl bg-paper"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">
              WhatsApp{" "}
              <span className="font-normal text-muted-foreground">
                (format 62…, tanpa +)
              </span>
            </Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              defaultValue={contact.whatsapp}
              placeholder="6281234567890"
              className="rounded-xl bg-paper"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={contact.email}
              className="rounded-xl bg-paper"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">
              Instagram{" "}
              <span className="font-normal text-muted-foreground">(tanpa @)</span>
            </Label>
            <Input
              id="instagram"
              name="instagram"
              defaultValue={contact.instagram}
              className="rounded-xl bg-paper"
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-card p-7 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-forest-deep">
              Pengurus Dusun
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Kepala dusun, ketua RT/RW, PKK, karang taruna — tampil di halaman
              Profil. Baris dengan jabatan/nama kosong tidak disimpan.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full bg-paper"
            onClick={() =>
              setOfficials((prev) => [...prev, { jabatan: "", nama: "" }])
            }
          >
            <Plus className="mr-1 size-4" />
            Tambah
          </Button>
        </div>

        <div className="space-y-3">
          {officials.map((official, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1.3fr_auto] items-center gap-3"
            >
              <Input
                name="official_jabatan"
                value={official.jabatan}
                onChange={(e) => updateOfficial(i, "jabatan", e.target.value)}
                placeholder="Jabatan — mis. Ketua RT 01"
                maxLength={60}
                className="rounded-xl bg-paper"
              />
              <Input
                name="official_nama"
                value={official.nama}
                onChange={(e) => updateOfficial(i, "nama", e.target.value)}
                placeholder="Nama lengkap"
                maxLength={80}
                className="rounded-xl bg-paper"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Hapus baris ${official.jabatan || i + 1}`}
                onClick={() =>
                  setOfficials((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <div className="lg:col-span-2">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="w-full rounded-full bg-forest-deep text-base hover:bg-forest sm:w-auto sm:px-10"
        >
          {pending ? (
            "Menyimpan…"
          ) : (
            <>
              <Save className="mr-1.5 size-4" />
              Simpan Pengaturan
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
