import ShowTile from "../show/ShowTile";
import { getTop10 } from "./HomeService";

export default async function Top10Row() {

    const shows = await getTop10();

    if (shows === null) return (<div>Error Loading Top 10</div>);

    return (
        <div className="flex">
            {shows.map((showId) => (
                <ShowTile key={showId} showId={showId.toString()} />
            ))}
        </div>
    )
};