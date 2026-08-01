"use client";

import { useTransition } from "react";
import { MailCheck, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMessage, setMessageRead } from "@/app/admin/actions";

export function MessageActions({
  id,
  isRead,
}: {
  id: string;
  isRead: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const result = await setMessageRead(id, !isRead);
      if (result.status === "success") toast.success(result.message);
      else toast.error(result.message);
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground"
        onClick={toggle}
        disabled={pending}
        aria-label={isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
      >
        {isRead ? (
          <MailOpen className="size-4" />
        ) : (
          <MailCheck className="size-4" />
        )}
      </Button>
      <DeleteButton
        action={() => deleteMessage(id)}
        title="Hapus pesan ini?"
        description="Pesan akan dihapus permanen."
      />
    </div>
  );
}
