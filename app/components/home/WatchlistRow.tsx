import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShowTile from "../show/ShowTile/ShowTile";
import { getWatchList } from "./HomeService";

export default async function WatchListRow ({userId}: {userId: string}) {

    const shows = await getWatchList({userId: userId});

    if (shows === null) return (<div>Error Loading Watchlist</div>);
    if (shows.length === 0) return (<div>No Shows in Watchlist. Add some shows to watch</div>);

    return (
        <div className="flex items-center justify-center mx-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
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