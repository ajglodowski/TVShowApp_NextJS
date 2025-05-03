import EditShowPage from "@/app/components/editShow/EditShow";
import { NewShow, Show } from "@/app/models/show";

export default function NewShowPage() {
    const newShow: Show = NewShow;
    return <EditShowPage show={newShow} presignedImageUrl={null} />
}