import CurrentlyAiringRowClient from "./CurrentlyAiringRowClient"
import { getCurrentlyAiring } from "../HomeService"
import { cacheLife } from "next/cache";

export default async function CurrentlyAiringRow({ userId }: { userId: string }) {
    'use cache'
    cacheLife('seconds');
    const currentlyAiringShows = await getCurrentlyAiring({userId: userId});
    return (
        <CurrentlyAiringRowClient currentlyAiringShows={currentlyAiringShows} />
    );
}