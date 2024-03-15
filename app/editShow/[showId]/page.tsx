import EditShowPage from "@/app/components/editShow/EditShow";

export default function EditShow({ params }: { params: { showId: string } }) {
  return <EditShowPage showId={params.showId} />
}