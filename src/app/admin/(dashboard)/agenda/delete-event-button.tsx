"use client";

import { DeleteButton } from "@/components/admin/delete-button";
import { deleteEvent } from "@/app/admin/actions";

export function DeleteEventButton({ id, title }: { id: string; title: string }) {
  return (
    <DeleteButton
      action={() => deleteEvent(id)}
      title={`Hapus "${title}"?`}
      description="Agenda akan dihapus permanen dari situs beserta gambar sampulnya."
    />
  );
}
