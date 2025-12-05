import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import ShowTile from "../show/ShowTile/ShowTile";
import ShowTileSkeleton from "../show/ShowTile/ShowTileSkeleton";
import { getWatchList } from "./HomeService";
export default async function WatchListRow ({userId}: {userId: string}) {

    'use cache'
    cacheTag('currentUserShowData');

    const shows = await getWatchList({userId: userId});

    if (shows === null) return (<div>Error Loading Watchlist</div>);
    if (shows.length === 0) return (<div>No Shows in Watchlist. Add some shows to watch</div>);

    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {shows.map((show) => (
                        <div key={show.id} className="m-2">
                            <ShowTile key={show.id} showDto={show} />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
};

export async function LoadingWatchlistRow() {
    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {Array.from({ length: 10 }).map((_, index) => (
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