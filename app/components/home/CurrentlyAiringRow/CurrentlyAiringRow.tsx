import CurrentlyAiringRowClient from "./CurrentlyAiringRowClient"
import { getCurrentlyAiring } from "../HomeService"

export default async function CurrentlyAiringRow({ userId }: { userId: string }) {
    const currentlyAiringShows = await getCurrentlyAiring({userId: userId});
    return (
        <CurrentlyAiringRowClient currentlyAiringShows={currentlyAiringShows} />
    );
}