import { notFound } from "next/navigation";
import { PageTitle } from "@/components/admin/page-title";
import { PostForm } from "@/components/admin/post-form";
import { adminGetPostById } from "@/lib/admin-data";

export default async function EditBeritaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await adminGetPostById(id);
  if (!post) notFound();

  return (
    <>
      <PageTitle
        title="Edit Tulisan"
        description={`Terakhir diubah ${new Intl.DateTimeFormat("id-ID", {
          dateStyle: "long",
          timeStyle: "short",
        }).format(new Date(post.updated_at))}`}
      />
      <PostForm post={post} />
    </>
  );
}
