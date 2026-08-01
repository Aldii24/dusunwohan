"use client";

import { DeleteButton } from "@/components/admin/delete-button";
import { deletePost } from "@/app/admin/actions";

export function DeleteRowButton({ id, title }: { id: string; title: string }) {
  return (
    <DeleteButton
      action={() => deletePost(id)}
      title={`Hapus "${title}"?`}
      description="Tulisan akan dihapus permanen dari situs beserta gambar sampulnya."
    />
  );
}
