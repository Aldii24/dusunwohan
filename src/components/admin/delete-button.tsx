"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/app/admin/actions";

interface DeleteButtonProps {
  /** Server action penghapus — dipanggil saat konfirmasi. */
  action: () => Promise<ActionState>;
  title: string;
  description?: string;
  size?: "sm" | "icon";
}

export function DeleteButton({
  action,
  title,
  description = "Tindakan ini tidak bisa dibatalkan.",
  size = "icon",
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await action();
      if (result.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setOpen(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {size === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Hapus"
          >
            <Trash2 className="size-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-1 size-3.5" />
            Hapus
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={pending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {pending ? "Menghapus…" : "Ya, hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
