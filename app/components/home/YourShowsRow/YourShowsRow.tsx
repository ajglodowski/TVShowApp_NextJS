import { getAllStatuses } from "../HomeService";
import YourShowsRowClient from "./YourShowsRowClient";

export default async function YourShowsRow ({userId}: {userId: string}) {
    
    const allStatuses = await getAllStatuses();

    return (
        <YourShowsRowClient userId={userId} allStatuses={allStatuses} />
    );
}

