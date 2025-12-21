import CurrentlyAiringRowClient from "./CurrentlyAiringRowClient"
import { getCurrentlyAiring } from "../HomeService"
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { currentUserShowDetailsStateTag } from "@/app/utils/cacheTags";

export default async function CurrentlyAiringRow({ userId }: { userId: string }) {
    'use cache'
    cacheTag(currentUserShowDetailsStateTag(userId));
    const currentlyAiringShows = await getCurrentlyAiring({userId: userId});
    return (
        <CurrentlyAiringRowClient currentlyAiringShows={currentlyAiringShows} />
    );
}