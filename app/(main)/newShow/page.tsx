import EditShowPage from "@/app/components/editShow/EditShow";
import { NewShow } from "@/app/models/newShow";
import { Show } from "@/app/models/show";

export default function NewShowPage() {
    const newShow: Show = NewShow;
    return <EditShowPage show={newShow} presignedImageUrl={null} />
}