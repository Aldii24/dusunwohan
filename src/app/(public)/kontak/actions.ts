"use server";

import { createPublicClient } from "@/lib/supabase/public";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message: string;
}

export async function sendMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  // honeypot anti-spam: manusia tidak mengisi field tersembunyi ini
  const website = String(formData.get("website") ?? "");

  if (website) return { status: "success", message: "Pesan terkirim. Terima kasih!" };

  if (!name || !contact || !content) {
    return {
      status: "error",
      message: "Mohon lengkapi nama, kontak, dan isi pesan.",
    };
  }
  if (content.length > 2000) {
    return { status: "error", message: "Pesan terlalu panjang (maks. 2000 karakter)." };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return {
      status: "error",
      message:
        "Form belum aktif karena database belum dikonfigurasi. Silakan hubungi kami lewat WhatsApp.",
    };
  }

  const { error } = await supabase
    .from("messages")
    .insert({ name: name.slice(0, 120), contact: contact.slice(0, 120), content });

  if (error) {
    console.error("sendMessage:", error.message);
    return {
      status: "error",
      message: "Terjadi kendala saat mengirim. Coba lagi atau hubungi lewat WhatsApp.",
    };
  }

  return {
    status: "success",
    message: "Pesan terkirim! Pengurus dusun akan membacanya segera.",
  };
}
