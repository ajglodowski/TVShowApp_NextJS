import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShowTileSkeleton from "../show/ShowTile/ShowTileSkeleton";
import { getCheckInShows } from "./HomeService";
import CheckInShowTile from "./CheckInShowTile";

export async function LoadingCheckInRow() {
    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="m-2">
                            <ShowTileSkeleton />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}

export default async function CheckInRow({ userId }: { userId: string }) {
    const shows = await getCheckInShows({ userId });

    if (!shows || shows.length === 0) {
        return (
            <div className="p-4 text-center text-gray-400">
                You're all caught up on your active shows!
            </div>
        );
    }

    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md pb-2">
                <div className="flex">
                    {shows.map((checkInShow) => (
                        <CheckInShowTile 
                            key={checkInShow.show.id} 
                            checkInShow={checkInShow}
                            userId={userId}
                        />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}
