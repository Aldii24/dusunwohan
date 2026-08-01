import { PageTitle } from "@/components/admin/page-title";
import { EventForm } from "@/components/admin/event-form";

export default function AgendaBaruPage() {
  return (
    <>
      <PageTitle
        title="Agenda Baru"
        description="Acara yang berstatus Terbit langsung tampil di halaman agenda."
      />
      <EventForm />
    </>
  );
}
