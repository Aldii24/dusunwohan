import { PageTitle } from "@/components/admin/page-title";
import { PostForm } from "@/components/admin/post-form";

export default function BeritaBaruPage() {
  return (
    <>
      <PageTitle
        title="Tulisan Baru"
        description="Kabar yang berstatus Terbit langsung tampil di situs publik."
      />
      <PostForm />
    </>
  );
}
