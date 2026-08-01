import { PageTitle } from "@/components/admin/page-title";
import { SettingsForm } from "@/components/admin/settings-form";
import { adminGetSettings } from "@/lib/admin-data";

export default async function AdminPengaturanPage() {
  const { stats, contact, officials } = await adminGetSettings();

  return (
    <>
      <PageTitle
        title="Pengaturan Situs"
        description="Statistik dusun, info kontak, dan susunan pengurus yang tampil di halaman publik."
      />
      <SettingsForm stats={stats} contact={contact} officials={officials} />
    </>
  );
}
