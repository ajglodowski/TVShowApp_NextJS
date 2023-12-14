import ShowTile from "../show/ShowTile";
import { getWatchList } from "./HomeService";

export default async function WatchListRow ({userId}: {userId: string}) {

    const shows = await getWatchList({userId: userId});

    if (shows === null) return (<div>Error Loading Watchlist</div>);
    if (shows.length === 0) return (<div>No Shows in Watchlist. Add some shows to watch</div>);

    return (
        <div className="flex">
            {shows.map((showId) => (
                <ShowTile key={showId} showId={showId.toString()} />
            ))}
        </div>
    )
};