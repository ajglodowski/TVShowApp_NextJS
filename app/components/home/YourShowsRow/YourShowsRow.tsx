import { Status } from "@/app/models/status";
import { getYourShows } from "../HomeClientService";
import { getAllStatuses } from "../HomeService";
import YourShowsRowClient from "./YourShowsRowClient";
import { Show } from "@/app/models/show";

export default async function YourShowsRow ({userId}: {userId: string}) {
    
    const allStatuses = await getAllStatuses();

    return (
        <YourShowsRowClient userId={userId} allStatuses={allStatuses} />
    );
}

