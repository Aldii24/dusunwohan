"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoMark } from "@/components/site/logo";
import { AdminNav } from "./sidebar";
import { signOut } from "@/app/admin/actions";

export function AdminHeader({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-paper/85 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Buka menu admin"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
          >
            <SheetTitle className="sr-only">Menu admin</SheetTitle>
            <div className="flex items-center gap-3 p-5">
              <LogoMark className="size-9" />
              <span className="font-display text-lg font-semibold">
                Panel Pengurus
              </span>
            </div>
            <div className="px-3">
              <AdminNav onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <p className="hidden text-sm text-muted-foreground sm:block">
          Masuk sebagai{" "}
          <span className="font-semibold text-forest-deep">{email}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full bg-card"
        >
          <Link href="/" target="_blank">
            Lihat Situs
            <ExternalLink className="ml-1 size-3.5" />
          </Link>
        </Button>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="rounded-full text-muted-foreground hover:text-destructive"
          >
            <LogOut className="mr-1 size-3.5" />
            Keluar
          </Button>
        </form>
      </div>
    </header>
  );
}
