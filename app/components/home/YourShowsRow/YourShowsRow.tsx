import { cacheLife } from "next/cache";
import { getAllStatuses } from "../HomeService";
import YourShowsRowClient from "./YourShowsRowClient";

type YourShowsRowProps = {
    userId: string;
    isHero?: boolean;
}

export default async function YourShowsRow ({userId, isHero = false}: YourShowsRowProps) {
    'use cache'
    cacheLife('seconds');
    const allStatuses = await getAllStatuses();
    return (
        <YourShowsRowClient userId={userId} allStatuses={allStatuses} isHero={isHero} />
    );
}

