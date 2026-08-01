import { PageTitle } from "@/components/admin/page-title";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { adminGetGallery } from "@/lib/admin-data";

export default async function AdminGaleriPage() {
  const items = await adminGetGallery();

  return (
    <>
      <PageTitle
        title="Galeri"
        description={`${items.length} foto. Foto diunggah langsung ke Cloudflare R2.`}
      />
      <GalleryManager items={items} />
    </>
  );
}
