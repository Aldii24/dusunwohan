"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  sendMessage,
  type ContactFormState,
} from "@/app/(public)/kontak/actions";

const initialState: ContactFormState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-3xl border border-forest/20 bg-card p-10 text-center">
        <CheckCircle2 className="size-12 text-forest" />
        <p className="mt-5 font-display text-2xl font-semibold text-forest-deep">
          Matur nuwun!
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5 rounded-3xl border border-border/80 bg-card p-7 md:p-9"
    >
      {/* honeypot — disembunyikan dari manusia */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nama Anda"
            required
            maxLength={120}
            className="h-11 rounded-xl bg-paper"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">No. HP / Email</Label>
          <Input
            id="contact"
            name="contact"
            placeholder="Agar kami bisa membalas"
            required
            maxLength={120}
            className="h-11 rounded-xl bg-paper"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Pesan</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Tulis kabar, pertanyaan, atau masukan Anda di sini…"
          required
          maxLength={2000}
          rows={6}
          className="rounded-xl bg-paper"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full rounded-full bg-forest-deep text-base hover:bg-forest"
      >
        {pending ? (
          "Mengirim…"
        ) : (
          <>
            Kirim Pesan
            <Send className="ml-1.5 size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
