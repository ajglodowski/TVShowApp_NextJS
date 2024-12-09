import EditShowPage from "@/app/components/editShow/EditShow";

export default async function EditShow({ params }: { params: Promise<{ showId: string }> }) {
  return <EditShowPage showId={(await params).showId} />
}