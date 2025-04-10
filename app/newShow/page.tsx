import EditShowPage from "../components/editShow/EditShow";
import { NewShow, Show } from "../models/show";

export default function NewShowPage() {
    const newShow: Show = NewShow;
    return <EditShowPage show={newShow} presignedImageUrl={null} />
}