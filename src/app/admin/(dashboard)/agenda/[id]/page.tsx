import { notFound } from "next/navigation";
import { PageTitle } from "@/components/admin/page-title";
import { EventForm } from "@/components/admin/event-form";
import { adminGetEventById } from "@/lib/admin-data";

export default async function EditAgendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await adminGetEventById(id);
  if (!event) notFound();

  return (
    <>
      <PageTitle title="Edit Agenda" />
      <EventForm event={event} />
    </>
  );
}
